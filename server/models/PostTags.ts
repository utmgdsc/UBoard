import { Sequelize, DataTypes, Model } from 'sequelize';

interface PostTagAttributes {
  postId: string;
  TagText: string;
}

export class PostTag
  extends Model<PostTagAttributes>
  implements PostTagAttributes
{
  postId!: string;
  TagText!: string;
}

module.exports = (sequelize: Sequelize) => {
  PostTag.init(
    {
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Posts',
          key: 'id',
        },
      },
      TagText: {
        type: DataTypes.STRING(24),
        allowNull: false,
        primaryKey: true,
        validate: {
          isAlphanumeric: true,
        },
        references: {
          model: 'Tags',
          key: 'text',
        },
      },
    },
    {
      sequelize,
      modelName: 'PostTag',
    }
  );
  return PostTag;
};
