import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
const config = require("../config/config");
const basename = path.basename(__filename);
const db: any = {};

let sequelize: Sequelize.Sequelize;

if (process.env.CI && process.env.CI.toLowerCase() === "true") {
  /* For CI testing */
  sequelize = new Sequelize.Sequelize("sqlite::memory");
} else {
  sequelize = new Sequelize.Sequelize(config.DB_URL, {
    dialect: config.dialect,
    dialectOptions: {
      ssl: {
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
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
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
