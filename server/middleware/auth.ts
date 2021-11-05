import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/user';

const secret = process.env.JWT_SECRET as string;

class UnauthorizedError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }

    this.name = 'UnauthorizedError';
    this.message = message;
  }
}

export function getAuthUser(res: Response): User {
  if (!res.locals.user) {
    const err = 'User is not authorized to perform this request';
    res.status(401).json({message: err});
    throw new UnauthorizedError(err);
  }

  return res.locals.user;
}

function auth(userRepo: typeof User) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;

      if (token) {
        const decodedData = jwt.verify(token, secret) as jwt.JwtPayload;
        res.locals.user = await userRepo.findOne({
          where: {
            id: decodedData?.id,
          },
        });
        next();
      } else {
        res.status(401).json({message: 'Missing token in cookie'});
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({message: 'Bad session'});
    }
  };
}

export default auth;
