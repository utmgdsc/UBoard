"use strict";

import { UUIDV4 } from "sequelize";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable("Users", {
      id:
      {
        type: Sequelize.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      userName:
      {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true
      },          
      password:
      {
        type: Sequelize.STRING,
        allowNull: false
      },   
      email:
      {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
        validate : {
          isEmail: true, /* Check for valid email format */
          is: [".*.utoronto.ca"],  /* Check for utoronto domain */
        }
      },
      lastLogin:
      {
        type: Sequelize.DATE,
      },
      karma: 
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
