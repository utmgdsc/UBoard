import express from "express";
import cookieParser from "cookie-parser";

import db from "./models/index";
import v1Routes from "./routes/v1";

if (process.env.JWT_SECRET) {
  const app = express();
  const port = 8080;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/api/v1", v1Routes);

  db.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });
} else {
  console.error("Missing jwt secret");
}
