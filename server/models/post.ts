"use strict";
import { Model, UUIDV4, DataTypes } from "sequelize"

interface PostAttributes {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  tags: string;
  location: string; 
  capacity: Number;
  feedbackScore: Number;
}

module.exports = (sequelize: any) => {
  class Post extends Model<PostAttributes> implements PostAttributes {
        id!: string;
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
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      title: {
        type: DataTypes.STRING,
      },
      body: {
        type: DataTypes.TEXT,
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
