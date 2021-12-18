import { Sequelize, QueryInterface, DataTypes, UUIDV4 } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [25, 1000],
            msg: 'Length Validation Failed', // Error handling
          },
        },
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      location: {
        // to use with maps API later
        type: DataTypes.STRING,
      },
      capacity: {
        type: DataTypes.INTEGER /* Optional: An event ad can indicate maximum capacity of attendees */,
      },
      coords: {
        // Coordinates to the event (if it is in-person)
        type: DataTypes.JSON,
        defaultValue: {
          // if not specified, -1 to indicate online event
          lat: -1,
          lng: -1,
        },
      },
      feedbackScore: {
        /* Post 'score' decreases if it is reported too many times, 
                          can increase if liked. Post with score too low is auto removed.*/
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    });
  },
  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.dropTable('Posts');
  },
};
