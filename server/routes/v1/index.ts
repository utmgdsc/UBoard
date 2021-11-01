import express from "express";
import userRouter from "./user";

const routes = express.Router();

routes.use("/user", userRouter);

export default routes;
