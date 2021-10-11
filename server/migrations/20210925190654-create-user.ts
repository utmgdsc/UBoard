"use strict";
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: true
      },
      userName: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNUll: false
      },
      email: {
      type: Sequelize.STRING(64),
      allowNull: false,
      unique: true,
      validate : {
         is: [".[a-zA-z\-\_\.0-9]*@[a-zA-z\-\_\.0-9]*utoronto.ca"],  // only utor emails
      }
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
