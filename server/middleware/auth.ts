import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET as string;

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.signedCookies.token;

    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, secret) as jwt.JwtPayload;
      res.locals.id = decodedData?.id;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
