"use strict";
import { Model, UUIDV4 } from "sequelize"

interface PostAttributes {
  id: string;
  userId: string; // Post author
  title: string;
  body: string;
  thumbnail: string;
  tags: string;
  location: string; // Integrate with maps later
  capacity: Number;
  feedbackScore: Number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Post extends Model<PostAttributes> implements PostAttributes {
        id!: string;
        userId!: string;  
        title!: string;
        body!: string;
        thumbnail!: string;
        tags!: string;
        location!: string;  
        capacity!: Number;
        feedbackScore!: Number;
    }
  Post.init(
    {
      id: {
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true
      },
      userId: {
        type: DataTypes.STRING,
      },

      title: {
        type: DataTypes.TEXT,
      },
      body: {
        type: DataTypes.STRING,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      tags: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      capacity: {
        type: DataTypes.INTEGER,
      },
      feedbackScore: {
        type: DataTypes.INTEGER,
      }
    },
    
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
