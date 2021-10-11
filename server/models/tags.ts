"use strict";
import Sequelize, { Model, DataTypes, UUIDV4 } from "sequelize";


interface TagAttribute {
  id: string;
  text: string;
}

module.exports = (sequelize: Sequelize.Sequelize) => {
  class Tag extends Model<TagAttribute> implements TagAttribute {
    id!: string;
    text!: string;

    static associate(model: any)
    {
      Tag.belongsToMany(model.Post, {through: "PostTags"}); /* Junction table for Post & Tags relationship */
    }

  }

  Tag.init(
    {
      id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
      },

      text: {
        type: DataTypes.STRING(24),
        allowNull: false,
        primaryKey: true,
        unique: true,
        validate: {
            is: ["[A-Z][a-z]*"] // only alphabetical tags, no other characters
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
