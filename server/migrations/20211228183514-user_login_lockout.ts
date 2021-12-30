import { Sequelize, QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, _: Sequelize) => {
    await queryInterface.addColumn(
      'Users', // table name
      'can_login_after', // new field name
      {
        type: DataTypes.DATE,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'Users', // table name
      'failed_login_attempts', // new field name
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    );
  },

  down: async (queryInterface: QueryInterface, _: Sequelize) => {
    await queryInterface.removeColumn('Users', 'can_login_after');
    await queryInterface.removeColumn('Users', 'failed_login_attempts');
  },
};
