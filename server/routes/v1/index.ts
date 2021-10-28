import express from "express";
import userRouter from "./user";

const allRoutes = express.Router();

allRoutes.use("/users/", userRouter);

export default allRoutes;
