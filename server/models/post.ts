import { BelongsToManyCreateAssociationMixinOptions } from 'sequelize';
import {
  Sequelize,
  Model,
  UUIDV4,
  DataTypes,
  Optional,
  BelongsToManyAddAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { Tag } from './tags';

interface PostAttributes {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  location: string;
  capacity: Number;
  feedbackScore: Number;

  UserId: string;
}

interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    'id' | 'thumbnail' | 'location' | 'capacity' | 'feedbackScore' | 'UserId'
  > {}

export class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  id!: string;
  title!: string;
  body!: string;
  thumbnail!: string;
  location!: string;
  capacity!: Number;
  feedbackScore!: Number;
  UserId!: string; /* Foreign Key from UserId */

  public getTags!: BelongsToManyGetAssociationsMixin<Tag>;
  public addTag!: BelongsToManyAddAssociationMixin<Tag, string>;
  public hasTag!: BelongsToManyHasAssociationMixin<Tag, string>;
  public countTags!: BelongsToManyCountAssociationsMixin;
  public createTag!: BelongsToManyCreateAssociationMixin<Tag>;

  static associate(model: any) {
    Post.belongsTo(model.User);
    Post.belongsToMany(model.Tag, {
      through: 'PostTags',
    }); /* Junction table for Post & Tags relationship */
  }
}

module.exports = (sequelize: Sequelize) => {
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
      feedbackScore: {
        /* Post 'score' decreases if it is reported too many times, 
                          can increase if liked. Post with score too low is auto removed.*/
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
