import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const basename = path.basename(__filename);
const db: any = {};

let sequelize: Sequelize;

if (
  (process.env.CI && process.env.CI.toLowerCase() === "true") ||
  !process.env.DATABASE_URL
) {
  /* For CI testing */
  sequelize = new Sequelize("sqlite::memory");
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        /* Required for our host */ rejectUnauthorized: false,
      },
    },
  });
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js")
    );
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
