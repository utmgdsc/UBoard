import { Model, Sequelize, DataTypes } from 'sequelize';

export class UserCheckin extends Model {
  userID!: string;
  postID!: string;

  static async howManyCheckedIn(postID: string) {
    return (await UserCheckin.count({ where: { postID } })).valueOf();
  }

  /**
   * Check the user in.
   */
  static async checkin(userID: string, postID: string) {
    return await UserCheckin.findOrCreate({
      where: { userID, postID },
      defaults: { userID, postID },
    });
  }

  /**
   * Check a user out of an event.
   * @returns True if the user has been checked out.
   */
  static async checkout(userID: string, postID: string) {
    return (await UserCheckin.destroy({ where: { userID, postID } })) == 1;
  }

  static associate(models: any) {
    UserCheckin.hasMany(models.User);
    UserCheckin.hasMany(models.Post);
  }
}

module.exports = (sequelize: Sequelize) => {
  UserCheckin.init(
    {
      userID: DataTypes.UUID,
      postID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'UserCheckin',
    }
  );
  return UserCheckin;
};
