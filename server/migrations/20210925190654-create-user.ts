import { UUIDV4 } from "sequelize";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      userName: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true /* In the controller, lets force email to lowercase */,
        validate: {
          isEmail: true /* Check for valid email format */,
          is: [".*@(mail.|alum.|)utoronto.ca"] /* Check for utoronto domain */,
        },
      },
      confirmed: {
        /* Email Confirmed */ type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastLogin: {
        type: Sequelize.DATE,
      },
      karma: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      confirmationToken: {
        type: Sequelize.STRING,
      },
      confirmationTokenExpires: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable("Users");
  },
};
