import express from "express";
import db from "./models/index";
import allRoutes from "./routes/v1";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/", allRoutes);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
