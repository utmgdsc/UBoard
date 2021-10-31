import express from "express";
import cookieParser from "cookie-parser";

import db from "./models/index";
import userRouter from "./routes/v1/user";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET));

app.use("/api/v1/user", userRouter);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
