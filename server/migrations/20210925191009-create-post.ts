import { UUIDV4 } from "sequelize";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable("Posts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [25, 1000],
            msg: "Length Validation Failed", // Error handling
          },
        },
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      location: {
        // to use with maps API later
        type: Sequelize.STRING,
      },
      capacity: {
        type: Sequelize.INTEGER /* Optional: An event ad can indicate maximum capacity of attendees */,
      },
      feedbackScore: {
        /* Post 'score' decreases if it is reported too many times, 
                          can increase if liked. Post with score too low is auto removed.*/
        type: Sequelize.INTEGER,
        defaultValue: 1,
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
    await queryInterface.dropTable("Posts");
  },
};
