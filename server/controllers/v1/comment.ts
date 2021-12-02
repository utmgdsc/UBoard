import { Comment } from '../../models/comment';
import db from '../../models';

// The return type of a Comment associated with the Post's User.
export type CommentsUser = Comment & {
  User: {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
};

// The maximum number of results to return.
const MAX_RESULTS = 50;

export default class CommentController {
  protected commentsRepo: typeof Comment;

  constructor(commentsRepo: typeof Comment) {
    this.commentsRepo = commentsRepo;
  }

  /**
   * CRUD method to get all the comments on a particular post.
   *
   * @param postID  - The identifier used to find the specific post.
   * @param limit   - Limit the comments to a number of results.
   * @param offset  - Offset the results
   * @returns A data object containing the results along.
   */
  async getComments(
    postID: string,
    limit: number,
    offset: number
  ): Promise<{
    status: number;
    data: { result?: CommentsUser[]; total?: number; message?: string };
  }> {
    const data = await Promise.all([
      // [0] contains the comments and the user it belongs to
      this.commentsRepo.findAll({
        limit: limit > MAX_RESULTS ? MAX_RESULTS : limit,
        // Since we are returning multiple results, we want to limit the data.
        attributes: ['id', 'body', 'UserId', 'PostId'],
        include: [
          {
            model: db.User,
            attributes: ['firstName', 'lastName', 'id', 'createdAt'],
          },
        ],
        order: [['createdAt', 'ASC']],
        offset: offset,
        where: { PostId: postID },
      }),
      // [1] returning the number of comments under this post
      this.commentsRepo.count({ where: { PostId: postID } }),
    ]);

    if (!data) {
      return {
        status: 404,
        data: { message: `Post ${postID} could not be found` },
      };
    }
    return {
      status: 200,
      data: {
        result: data[0] as any as CommentsUser[],
        total: data[1],
      },
    };
  }

  /**
   * Search for a specific comment if it exists
   *
   * @param commentID - The identifer used to find the specific comment
   * @returns The details of the post
   */
  async getComment(commentID: string): Promise<{
    status: number;
    data: { result?: CommentsUser; message?: string };
  }> {
    const data = (await this.commentsRepo.findByPk(commentID, {
      attributes: ['id', 'body'],
      include: [
        {
          model: db.User,
          attributes: ['id', 'firstName', 'lastName', 'createdAt'],
        },
      ],
    })) as CommentsUser;

    if (!data) {
      return {
        status: 404,
        data: { message: `Comment ${commentID} could not be found` },
      };
    }
    return {
      status: 200,
      data: { result: data },
    };
  }

  /**
   * Delete the post by a given ID.
   *
   * @param userId - The identifier of author of the comment to destroy.
   * @param commentId - The identifier of the comment to destroy.
   * @returns A status object indicating the results of the action.
   */
  async deleteComment(
    userId: string,
    commentId: string
  ): Promise<{ status: number; data?: { message?: string } }> {
    const result = await this.commentsRepo.findOne({
      where: { id: commentId },
    });

    if (!result) {
      return {
        status: 404,
        data: {
          message: `Comment ${commentId} could not be deleted.`,
        },
      };
    } else if (result.UserId != userId) {
      return {
        status: 401,
        data: { message: 'Unauthorized to delete the comment.' },
      };
    }
    await result.destroy();
    return { status: 204 };
  }

  /**
   * Create a new comment
   *
   * @param body  - The content of the comment.
   * @param userID - The identifier of the author of the comment.
   * @param postID - The identifier of the post that the comment is written to.
   * @returns create  a new comment and return it if successful or message if not.
   */
  async createComment(
    body: string,
    userID?: string,
    postID?: string
  ): Promise<{ status: number; data: { result?: Comment; message?: string } }> {
    if (!body || !userID || !postID) {
      return { status: 400, data: { message: 'Missing fields.' } };
    }

    const comment = await this.commentsRepo.create({
      body: body,
      UserId: userID,
      PostId: postID,
    });

    if (!comment) {
      return {
        status: 500,
        data: { message: 'Could not create the new comment' },
      };
    }

    return { status: 200, data: { result: comment } };
  }

  /**
   * Update the commend by ID
   *
   * @param currentUserId - user trying to make the update
   * @param commentID - comment's ID
   * @param body - udpated comment body
   * @returns A result object indicating whether the update was successful, with the updated comment if
   * it was updated.
   */
  async updateComment(
    currentUserId: string,
    commentID: string,
    body?: string
  ): Promise<{
    status: number;
    data?: { message?: string; result?: Comment };
  }> {
    const comment = (await this.getComment(commentID)).data.result;

    if (comment && comment.User.id == currentUserId) {
      try {
        comment.body = body || comment.body;
        await comment.save();
        return { status: 200, data: { result: comment } };
      } catch (err) {
        console.error(`Could not update comment ${commentID}\n`, err);
        return {
          status: 500,
          data: { message: 'Could not update the comment.' },
        };
      }
    } else if (comment) {
      return {
        status: 401,
        data: { message: 'Not authorized to edit this comment.' },
      };
    }
    return { status: 404, data: { message: 'Could not find comment.' } };
  }
}
