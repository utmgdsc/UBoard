import { Sequelize, Model, DataTypes } from 'sequelize';

export class UserPostLikes extends Model {
  userID!: string;
  postID!: string;

  /**
   * Likes the given post by the user.
   * @param userID - The ID  of the user liking the post.
   * @param postID - The ID of the post to be liked.
   * @returns The newly created model.
   */
  static async likePost(userID: string, postID: string) {
    return await UserPostLikes.findOrCreate({
      where: { userID, postID },
      defaults: { userID, postID },
    });
  }

  /**
   * Un-likes a liked post.
   *
   * Does not check if a post has been liked prior to executing the operation.
   *
   * @param userID - The ID of the user un-liking the post
   * @param postID - The ID of the post being un-liked.
   * @returns True if the operation succeeded.
   */
  static async unlikePost(userID: string, postID: string) {
    return (await UserPostLikes.destroy({ where: { userID, postID } })) == 1;
  }

  /**
   * Get the number of likes for a post.
   * @param postID - The ID of the post to get the like count for.
   * @returns The number of likes for the given post.
   */
  static async getLikeCount(postID: string) {
    return await UserPostLikes.count({ where: { postID } });
  }

  /**
   * Checks whether the user likes the post.
   *
   * @param userID - The ID of the user we want to check.
   * @param postID - The ID of the post we want to check.
   * @returns True if the user likes the post.
   */
  static async doesLikePost(userID: string, postID: string) {
    return (await UserPostLikes.count({ where: { userID, postID } })) == 1;
  }

  static associate(models: any) {
    UserPostLikes.hasMany(models.User);
    UserPostLikes.hasMany(models.Post);
  }
}
module.exports = (sequelize: Sequelize) => {
  UserPostLikes.init(
    {
      userID: DataTypes.UUID,
      postID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'UserPostLikes',
    }
  );
  return UserPostLikes;
};
