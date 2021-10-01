"use strict";
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable("Users", {
      uid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUIDV4,
        unique: true
      },
      userName: {
        type: Sequelize.STRING(8),
        allowNull: false,
        unique: true

      },
      password: {
        type: Sequelize.STRING,
        allowNUll: false
      },
      salt: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      lastLogin: {
        type: Sequelize.DATE,
      },
      karma: {
        type: Sequelize.INTEGER,
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
