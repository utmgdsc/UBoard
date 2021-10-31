import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

interface CommentAttribute {
  id: string;
  body: string;
}

export class Comment
  extends Model<CommentAttribute>
  implements CommentAttribute
{
  id!: string;
  body!: string;
  UserId?: string;
  PostId?: string;

  static associate(models: any) {
    Comment.belongsTo(models.Post, {
      foreignKey: { allowNull: false },
    }); /* Postid will be in Comment */
  }
}

module.exports = (sequelize: Sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      body: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          len: [25, 200],
          msg: "Length Validation Failed",
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
