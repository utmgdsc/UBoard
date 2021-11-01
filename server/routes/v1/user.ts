import express, { Request, Response } from "express";
import moment from "moment";
import jwt from "jsonwebtoken";

import EmailService from "../../services/emailService";
import db from "../../models";
import UserController from "../../controllers/v1/user";
import { User } from "../../models/user";

const userRouter = express.Router();

export const uContr: UserController = new UserController(
  db.User,
  new EmailService()
);

let response;
let user: User | undefined;

export async function signInHandler(req: Request, res: Response) {
  const { userName, password } = req.body;
  response = await uContr.signIn(userName, password);
  user = response.data.result;

  if (user) {
    if (!process.env.SECRET) {
      throw "Undefined secret";
    }

    try {
      const token = jwt.sign(
        { username: user.userName, id: user.id },
        process.env.SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", JSON.stringify(token), {
        httpOnly: true,
        expires: moment().add(1, "hour").toDate(),
        signed: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
      return;
    }
  }

  res.status(response.status).json(response.data);
}

export async function signUpHandler(req: Request, res: Response) {
  const { email, userName, password, firstName, lastName } = req.body;
  response = await uContr.createUser(
    email,
    userName,
    password,
    firstName,
    lastName
  );

  res.status(response.status).json(response.data);
}

async function confirmEmailHandler(req: Request, res: Response) {
  const token = req.params.token;

  if (!token) {
    res.status(400).json({ code: 400, message: "Missing token." });
    return;
  }

  const status = await uContr.confirmEmail(token);

  if (status) {
    res.status(204);
  } else {
    res
      .status(400)
      .json({ code: 400, message: "Token is invalid or expired." });
  }
}

async function resetPassHandler(req: Request, res: Response) {
  if (!req.params.token || !req.body.pass || !req.body.confpw) {
    res.status(400).json({
      code: 400,
      message: "Missing token or password.",
    });
    return;
  }

  const status = await uContr.resetPassword(
    req.params.token,
    req.body.pass,
    req.body.confpw
  );

  if (status) {
    res.status(204);
  } else {
    res
      .status(400)
      .json({ code: 400, message: "Token is invalid or expired." });
  }
}

if (process.env.CI && process.env.CI == "false") {
  userRouter.post("/signin", signInHandler);
  userRouter.post("/signup", signUpHandler);

  userRouter.get("/confirmation/c=:token", confirmEmailHandler);
  userRouter.get("/reset-password/r=:token", resetPassHandler);
}

export default userRouter;
