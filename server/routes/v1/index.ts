import express from "express";
import userRouter from "./user";

const routes = express.Router();

routes.use("/users", userRouter);

export default routes;
