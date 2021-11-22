import { Sequelize, QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.createTable("PostComments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      body: {
        type: DataTypes.STRING(200),
        validate: {
          len: [25, 200],
          msg: "Length Validation Failed",
        },
        allowNull: false,
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
    await queryInterface.dropTable("PostComments");
  },
};
