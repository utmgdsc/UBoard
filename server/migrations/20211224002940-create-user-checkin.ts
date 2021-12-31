import { Sequelize, QueryInterface, DataTypes } from 'sequelize';
module.exports = {
  up: async (queryInterface: QueryInterface, _: Sequelize) => {
    await queryInterface.createTable('UserCheckins', {
      userID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      postID: {
        type: DataTypes.UUID,
        primaryKey: true,
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
  down: async (queryInterface: QueryInterface, _: Sequelize) => {
    await queryInterface.dropTable('UserCheckins');
  },
};
