import { Sequelize, Model, DataTypes } from "sequelize";

export interface TagAttribute {
  text: string;
}

export class Tag extends Model<TagAttribute> implements TagAttribute {
  text!: string;
  static associate(model: any) {
    Tag.belongsToMany(model.Post, {
      through: "PostTags",
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
      modelName: "Tag",
    }
  );
  return Tag;
};
