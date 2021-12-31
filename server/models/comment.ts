import { Sequelize, Model, DataTypes, UUIDV4, Optional } from 'sequelize';

interface CommentAttributes {
  id: string;
  body: string;
  UserId: string;
  PostId: string;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  id!: string;
  body!: string;
  UserId!: string;
  PostId!: string;

  static associate(models: any) {
    Comment.belongsTo(models.Post, {
      foreignKey: { allowNull: false },
    }); /* Postid will be in Comment */
    Comment.belongsTo(models.User);
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
        type: DataTypes.STRING(250), // cap comments to 250 char
        allowNull: false,
        validate: {
          len: {
            args: [10, 250],
            msg: 'Length Validation Failed', // Error handling
          },
        },
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      PostId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
