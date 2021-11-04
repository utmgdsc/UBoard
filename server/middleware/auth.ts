import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const secret = process.env.JWT_SECRET as string;

function getAuthUser(res: Response): User | undefined {
  if (!res.locals.user) {
    res.status(401).json({ message: "User is not authorized to perform this request" })
    return;
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
        res.status(401).json({ message: "Missing token in cookie" });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Bad session" });
    }
  };
}

export default auth;
