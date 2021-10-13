"use strict";
import Sequelize, { Model, DataTypes, UUIDV4 } from "sequelize";


interface TagAttribute {
  text: string;
}

module.exports = (sequelize: Sequelize.Sequelize) => {
  class Tag extends Model<TagAttribute> implements TagAttribute {
    text!: string;

    static associate(model: any)
    {
      Tag.belongsToMany(model.Post, {through: "PostTags", foreignKey: { allowNull: false }}); /* Junction table for Post & Tags relationship */
    }

  }

  Tag.init(
    {
      text: {
        type: DataTypes.STRING(24),
        allowNull: false,
        primaryKey: true,
        unique: true,
        validate: {
            isAlphanumeric: true
        }
      },
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};
