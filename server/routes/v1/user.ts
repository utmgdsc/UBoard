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
    const token = req.params.token;

    if (!token) {
      res.status(400).send({ code: 400, message: "Missing token." });
      return;
    }

    const status = await uContr.confirmEmail(token);

    if (status) {
      res.status(204);
    } else {
      res
        .status(400)
        .send({ code: 400, message: "Token is invalid or expired." });
    }
  }
);

userRouter.get(
  "/reset-password/r=:token",
  async (req: Request, res: Response) => {
    if (!req.params.token || !req.body.pass || !req.body.confpw) {
      res.status(400).send({
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
        .send({ code: 400, message: "Token is invalid or expired." });
    }
  }
);

export default userRouter;
