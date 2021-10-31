import express, { Request, Response } from "express";
import moment from "moment";
import EmailService from "../../services/emailService";

import db from "../../models/index";
import UserController from "../../controllers/v1/user";

const router = express.Router();

export const userController: UserController = new UserController(db.User, new EmailService());
let response;

export async function signInHandler(
  req: Request,
  res: Response
) {
  const { userName, password } = req.body;
  response = await userController.signIn(userName, password);

  if (response.data.token) {
    res.cookie("token", JSON.stringify(response.data.token), {
      httpOnly: true,
      expires: moment().add(1, "hour").toDate(),
      signed: true,
    });
  }

  res.status(response.status).json(response.data);
}

export async function signUpHandler(
  req: Request,
  res: Response
) {
  const { email, userName, password, firstName, lastName } = req.body;
  response = await userController.createUser(
    email,
    userName,
    password,
    firstName,
    lastName
  );

  if (response.data.token) {
    res.cookie("token", JSON.stringify(response.data.token), {
      httpOnly: true,
      expires: moment().add(1, "hour").toDate(),
      signed: true,
    });
  }

  res.status(response.status).json(response.data);
}

if (process.env.CI && process.env.CI == "false") {
  router.post("/signin", signInHandler);
  router.post("/signup", signUpHandler);
}

export default router;
