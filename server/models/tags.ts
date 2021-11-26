import {
  Sequelize,
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
} from 'sequelize';
import { Post } from './post';

export interface TagAttribute {
  text: string;
}

export class Tag extends Model<TagAttribute> implements TagAttribute {
  text!: string;

  /* TS Declarations for the association */
  public getPosts!: BelongsToManyGetAssociationsMixin<Post>;
  public addPost!: BelongsToManyAddAssociationMixin<Post, string>;
  public hasPost!: BelongsToManyHasAssociationMixin<Post, string>;
  public countPosts!: BelongsToManyCountAssociationsMixin;
  public createPost!: BelongsToManyCreateAssociationMixin<Post>;

  static associate(model: any) {
    Tag.belongsToMany(model.Post, {
      through: 'PostTags',
    }); /* Junction table for Post & Tags relationship */
  }
}

module.exports = (sequelize: Sequelize) => {
  Tag.init(
    {
      text: {
        type: DataTypes.STRING(24),
        allowNull: false,
        primaryKey: true,
        unique: true,
        validate: {
          isAlphanumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Tag',
    }
  );
  return Tag;
};
