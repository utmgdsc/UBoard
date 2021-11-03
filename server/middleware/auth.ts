import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const secret = process.env.JWT_SECRET as string;

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
        res.status(401).json({ message: "Missing token in cookie" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default auth;
