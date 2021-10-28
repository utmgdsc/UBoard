import express, { Request, Response } from "express";
import db from "../../models";
import EmailService from "../../services/emailService";
import UserController from "../../controllers/v1/user";

const userRouter = express.Router();
const eServ = new EmailService();
const uContr = new UserController(db.User, eServ);

userRouter.get(
  "/confirmation/c=:token",
  async (req: Request, res: Response) => {
    const status: boolean = await uContr.confirmEmail(req.params.token);

    if (status) {
      res.status(200).send("Your email address has been confirmed. ");
    }

    res
      .status(401)
      .send("An error occurred. The link is either invalid or expired. ");
  }
);

userRouter.get(
  "/reset-password/r=:token",
  async (req: Request, res: Response) => {
    const status: boolean = await uContr.resetPassword(
      req.params.token,
      req.body.pass,
      req.body.confpw
    );

    if (status) {
      res.status(200).send("Your password has been changed!");
    }

    res.status(401).send("An error occurred.");
  }
);

export default userRouter;
