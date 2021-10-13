"use strict";
import Sequelize, { Model, UUIDV4, DataTypes } from "sequelize"

interface PostAttributes {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  location: string; 
  capacity: Number;
  feedbackScore: Number;
}

module.exports = (sequelize: Sequelize.Sequelize) => {
  class Post extends Model<PostAttributes> implements PostAttributes {
        id!: string;
        title!: string;
        body!: string;
        thumbnail!: string;
        location!: string;  
        capacity!: Number;
        feedbackScore!: Number;
    
    
    static associate(model: any)
    {
      Post.belongsToMany(model.Tag, {through: "PostTags", foreignKey: { allowNull: false }}); /* Junction table for Post & Tags relationship */
    }
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
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      location: { // to use with maps API later
        type: DataTypes.STRING,
      },
      capacity: {
        type: DataTypes.INTEGER, /* Optional: An event ad can indicate maximum capacity of attendees */
      },
      feedbackScore: { /* Post 'score' decreases if it is reported too many times, 
                          can increase if liked. Post with score too low is auto removed.*/
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
