"use strict";
import Sequelize, { Model, DataTypes, UUIDV4 } from "sequelize";


interface CommentAttribute {
  id: string;
  body: string;

}

module.exports = (sequelize: Sequelize.Sequelize) => {
  class Comment extends Model<CommentAttribute> implements CommentAttribute {
    id!: string;
    body!: string;

    static associate(models: any) {
      Comment.belongsTo(models.Post); /* Postid will be in Comment */
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
