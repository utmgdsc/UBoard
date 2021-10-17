import { Sequelize, QueryInterface, DataTypes, UUIDV4 } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      userName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true /* In the controller, lets force email to lowercase */,
        validate: {
          isEmail: true /* Check for valid email format */,
          is: [".*@(mail.|alum.|)utoronto.ca"] /* Check for utoronto domain */,
        },
      },
      confirmed: {
        /* Email Confirmed */ type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
      },
      karma: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      confirmationToken: {
        type: DataTypes.STRING,
      },
      confirmationTokenExpires: {
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
