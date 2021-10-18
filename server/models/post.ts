import Sequelize, { Model, UUIDV4, DataTypes } from "sequelize";

interface PostAttributes {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  location: string;
  capacity: Number;
  feedbackScore: Number;
}

export class Post extends Model<PostAttributes> implements PostAttributes {
  id!: string;
  title!: string;
  body!: string;
  thumbnail!: string;
  location!: string;
  capacity!: Number;
  feedbackScore!: Number;

  UserId?: string; /* Foreign Key from UserId. Defined this way for TS */

  static associate(model: any) {
    Post.belongsToMany(model.Tag, {
      through: "PostTags",
    }); /* Junction table for Post & Tags relationship */
  }
}

module.exports = (sequelize: Sequelize.Sequelize) => {
  Post.init(
    {
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
            msg: "Length Validation Failed", // Error handling
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
      feedbackScore: {
        /* Post 'score' decreases if it is reported too many times, 
                          can increase if liked. Post with score too low is auto removed.*/
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
