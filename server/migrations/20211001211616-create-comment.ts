module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable("PostComments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: true,
      },
      body: {
        type: Sequelize.STRING(200),
        validate: {
          len: [25, 200],
          msg: "Length Validation Failed",
        },
        allowNull: false,
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
    await queryInterface.dropTable("PostComments");
  },
};
