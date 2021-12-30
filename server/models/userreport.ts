import { Sequelize, Model, DataTypes } from 'sequelize';

export class UserReports extends Model {
  /**
   * Report a post and return the number of times this post has been reported.
   */
  static async reportPost(userID: string, postID: string) {
    await UserReports.findOrCreate({
      where: { userID, postID },
      defaults: { userID, postID },
    });
    return await UserReports.count({ where: { postID } }).valueOf();
  }

  static associate(models: any) {
    UserReports.hasMany(models.User);
    UserReports.hasMany(models.Post);
  }
}

module.exports = (sequelize: Sequelize) => {
  UserReports.init(
    {
      userID: DataTypes.UUID,
      postID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'UserReports',
    }
  );
  return UserReports;
};
