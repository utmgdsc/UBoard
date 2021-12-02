import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import EmailService from '../../services/emailService';
import db from '../../models';
import UserController from '../../controllers/v1/user';
import { getAuthUser } from '../../middleware/auth';

const userRouter = express.Router();
const baseRoute = `${process.env.PAGE_URL}`;
const cookie_key = 'token';

const uContr: UserController = new UserController(
  db.User,
  new EmailService(baseRoute)
);

async function signOut(req: Request, res: Response) {
  res
    .clearCookie(cookie_key, {
      httpOnly: true,
    })
    .status(204)
    .json();
}

export async function signInHandler(req: Request, res: Response) {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      res.status(400).json({
        message:
          (!userName
            ? !password
              ? 'Username and password'
              : 'Username'
            : 'Password') + ' not provided',
      });
      return;
    }

    const response = await uContr.signIn(userName, password);
    const user = response.data.result;

    if (user) {
      const token = jwt.sign(
        { username: user.userName, id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      const getDateOffset = (hours: number) => {
        const today = new Date();
        today.setHours(today.getHours() + hours);
        return today;
      };

      res
        .cookie(cookie_key, token, {
          httpOnly: true,
          expires: getDateOffset(1),
        })
        .status(response.status)
        .json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function signUpHandler(req: Request, res: Response) {
  const { email, userName, password, firstName, lastName } = req.body;

  if (!email || !userName || !password || !firstName || !lastName) {
    res.status(400).json({ message: 'Missing values in request body' });
    return;
  }

  const response = await uContr.createUser(
    email,
    userName,
    password,
    firstName,
    lastName
  );

  res.status(response.status).json(response.data);
}

async function requestPasswordResetHandler(req: Request, res: Response) {
  const result = await uContr.sendResetEmail(req.body.email);
  if (result.data) {
    console.error(result.data.message);
    res.status(result.status).json(result.data);
    return;
  }
  res.status(result.status).json();
}

async function confirmEmailHandler(req: Request, res: Response) {
  const token = req.body.token as string;

  if (!token) {
    res.status(400).json({ message: 'Missing token.' });
    return;
  }

  if (await uContr.confirmEmail(token)) {
    res.status(204).json();
  } else {
    res.status(400).json({ message: 'Token is invalid or expired.' });
  }
}

async function resetPassHandler(req: Request, res: Response) {
  if (!req.body.token || !req.body.password || !req.body.confirmPassword) {
    res.status(400).json({
      message: 'Missing token or password.',
    });
    return;
  }

  const status = await uContr.resetPassword(
    req.body.token,
    req.body.password,
    req.body.confirmPassword
  );

  if (status) {
    res.status(204).json();
  } else {
    res.status(400).json({ message: 'Token is invalid or expired.' });
  }
}

async function me(req: Request, res: Response) {
  try {
    const user = getAuthUser(res);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
  }
}

userRouter.post('/signin', signInHandler);
userRouter.post('/signup', signUpHandler);
userRouter.post('/signout', signOut);
userRouter.post('/request-password-reset', requestPasswordResetHandler);

userRouter.put('/confirm-email', confirmEmailHandler);
userRouter.put('/reset-password', resetPassHandler);

userRouter.get('/me', me);

export default userRouter;
