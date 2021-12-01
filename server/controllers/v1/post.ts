import sequelize from 'sequelize';
import { Post } from '../../models/post';
import { UserPostLikes } from '../../models/userPostLikes';
import db from '../../models';
import { QueryTypes } from 'sequelize';

// The return type of a Post associated with the Post's User.
export type PostUser = Post & {
  likeCount: number;
  doesUserLike: boolean;
  User: { id: string; firstName: string; lastName: string };
};

export type PostUserPreview = {
  id: string;
  thumbnail: string;
  body: string;
  title: string;
  createdAt: Date;
  likeCount: number;
  doesUserLike: boolean;
} & {
  User: { id: string; firstName: string; lastName: string };
};

// The maximum number of results to return.
const MAX_RESULTS = 50;

export default class PostController {
  protected postsRepo: typeof Post;
  protected userPostLikesRepo: typeof UserPostLikes;

  constructor(postsRepo: typeof Post, userPostLikesRepo: typeof UserPostLikes) {
    this.postsRepo = postsRepo;
    this.userPostLikesRepo = userPostLikesRepo;
  }

  /**
   * CRUD method to get all the posts.
   *
   * @param limit - Limit the posts to a number of results.
   * @param offset - Offset the results
   * @returns A data object containing the results.
   */
  async getPosts(
    userID: string,
    limit: number,
    offset: number,
    query?: string
  ): Promise<{
    status: number;
    data: { result?: PostUserPreview[]; count: number; total: number };
  }> {
    const data = await Promise.all([
      this.postsRepo.findAndCountAll({
        limit: limit > MAX_RESULTS ? MAX_RESULTS : limit,
        // Since we are returning multiple results, we want to limit the data.
        attributes: [
          'id',
          'body',
          'title',
          'createdAt',
          'thumbnail',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "UserPostLikes" as "Likes" WHERE "Likes"."postID" = "Post"."id")`
            ),
            'likeCount',
          ],
          [
            sequelize.literal(
              // https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-escape
              `(SELECT COUNT(*) FROM "UserPostLikes" as "Likes" 
                  WHERE "Likes"."postID" = "Post"."id" AND "Likes"."userID" = ${db.sequelize.escape(
                    `${userID}`
                  )})`
            ),
            'doesUserLike',
          ],
        ],
        include: [
          {
            model: db.User,
            attributes: ['firstName', 'lastName', 'id'],
          },
        ],

        order: [['createdAt', 'DESC']],
        offset: offset,
      }),
      this.postsRepo.count(),
    ]);

    return {
      status: data[0].count > 0 ? 200 : 204,
      data: {
        result: (data[0].rows as any as PostUserPreview[]).map((p) => {
          // Must case to `any` as dataValues is not typed at the moment.
          // Context: https://github.com/RobinBuschmann/sequelize-typescript/issues/760
          p.likeCount = (p as any).dataValues.likeCount;
          p.doesUserLike = (p as any).dataValues.doesUserLike == 1;
          return p;
        }),
        count: data[0].count,
        total: data[1],
      },
    };
  }

  async getPostsByQuery(
    userID: string,
    query: string,
    limit: number,
    offset: number
  ): Promise<{
    status: number;
    data: { result?: PostUserPreview[]; count: number; total: number };
  }> {
    await db.sequelize.query(
      `CREATE TABLE "PostSearches" AS 
      SELECT *, (
        setweight(to_tsvector(coalesce("title",'')), 'A') || 
        setweight(to_tsvector(coalesce("location",'')), 'C') || 
        setweight(to_tsvector(coalesce("body",'')), 'D')
      ) as "tsvector" 
      FROM "Posts";`
    );
    const data = await Promise.all([
      db.sequelize.query(
        `SELECT 
          "PostSearch"."id", 
          "PostSearch"."body", 
          "PostSearch"."title", 
          "PostSearch"."createdAt", 
          "PostSearch"."thumbnail", 
          (SELECT COUNT(*) FROM "UserPostLikes" as "Likes" 
            WHERE "Likes"."postID" = "PostSearch"."id") AS "likeCount", 
          (SELECT COUNT(*) FROM "UserPostLikes" as "Likes" 
            WHERE "Likes"."postID" = "PostSearch"."id" AND "Likes"."userID" = $1) AS "doesUserLike", 
          "User"."firstName" AS "User.firstName", 
          "User"."lastName" AS "User.lastName", 
          "User"."id" AS "User.id", 
          ts_rank_cd("tsvector", "query", 1|4) as "rank" 
        FROM "PostSearches" AS "PostSearch" 
        LEFT OUTER JOIN "Users" AS "User" ON "PostSearch"."UserId" = "PostSearch"."id" 
        CROSS JOIN to_tsquery($2) AS "query" 
        WHERE "query" @@ "tsvector" 
        ORDER BY "PostSearch"."createdAt" DESC 
        LIMIT $3 
        OFFSET $4;`,
        {
          bind: [userID, query, limit, offset],
          type: QueryTypes.SELECT,
        }
      ),
      this.postsRepo.count(),
    ]);
    await db.sequelize.query(`DROP TABLE "PostSearches";`);

    return {
      status: data[0].count > 0 ? 200 : 204,
      data: {
        result: (data[0].rows as any as PostUserPreview[]).map((p) => {
          // Must case to `any` as dataValues is not typed at the moment.
          // Context: https://github.com/RobinBuschmann/sequelize-typescript/issues/760
          p.likeCount = (p as any).dataValues.likeCount;
          p.doesUserLike = (p as any).dataValues.doesUserLike == 1;
          return p;
        }),
        count: data[0].count,
        total: data[1],
      },
    };
  }

  /**
   * Search for the post by the given ID if it exists.
   *
   * @param userID - The user making the request.
   * @param postID - The identifier used to find the specific post.
   * @returns The details of the post
   */
  async getPost(
    userID: string,
    postID: string
  ): Promise<{
    status: number;
    data: { result?: PostUser; message?: string };
  }> {
    const data = (await this.postsRepo.findByPk(postID, {
      attributes: [
        'id',
        'title',
        'body',
        'thumbnail',
        'location',
        'capacity',
        'feedbackScore',
        'UserId',
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "UserPostLikes" as "Likes" WHERE "Likes"."postID" = "Post"."id")`
          ),
          'likeCount',
        ],
        [
          sequelize.literal(
            // https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-escape
            `(SELECT COUNT(*) FROM "UserPostLikes" as "Likes" 
                WHERE "Likes"."postID" = "Post"."id" AND "Likes"."userID" = ${db.sequelize.escape(
                  `${userID}`
                )})`
          ),
          'doesUserLike',
        ],
      ],
      include: [
        {
          model: db.User,
          attributes: ['firstName', 'lastName', 'userName'],
        },
      ],
    })) as PostUser;

    if (!data) {
      return {
        status: 404,
        data: { message: `Post ${postID} could not be found` },
      };
    }
    const result = {
      status: 200,
      data: { result: data },
    };

    result.data.result.likeCount = (data as any).dataValues.likeCount;
    result.data.result.doesUserLike = (data as any).dataValues.doesUserLike;

    return result;
  }

  /**
   * Delete the post by a given ID.
   *
   * @param postID - The identifier of the post to destroy.
   * @returns A status object indicating the results of the action.
   */
  async deletePost(
    userId: string,
    postID: string
  ): Promise<{ status: number; data?: { message?: string } }> {
    const result = await this.postsRepo.findOne({ where: { id: postID } });

    if (!result) {
      return {
        status: 404,
        data: { message: `Post ${postID} could not be deleted.` },
      };
    } else if (result.UserId != userId) {
      return {
        status: 401,
        data: { message: 'Unauthorized to delete the post.' },
      };
    }
    await result.destroy();
    return { status: 204 };
  }

  /**
   * Change the vote of a given post
   * @param postID - The identifier of the post the vote on.
   * @param amount - 1 if it should be incremented, -1 if it should be decremented.
   * @returns A status object indicating if the action was successful.
   */
  private async vote(
    postID: string,
    amount: 1 | -1
  ): Promise<{ status: number; data?: { result?: Post; message?: string } }> {
    // TODO: Once reporting has been implemented this can be removed
    const data = await this.postsRepo.findByPk(postID);

    if (!data) {
      return { status: 404, data: { message: 'Could not find post.' } };
    }

    try {
      (data.feedbackScore as number) += amount;
      await data.save();
      return { status: 204, data: { result: data } };
    } catch (err) {
      console.error(`Could not change vote for: ${postID}`);
      return {
        status: 400,
        data: {
          message: `Could not ${
            amount == 1 ? 'upvote' : 'report'
          } post: ${postID}`,
        },
      };
    }
  }

  /**
   * Downvote a given post.
   *
   * @param postID - The post to downvote.
   * @returns A status object indicating whether the post was downvoted.
   */
  async report(
    postID: string
  ): Promise<{ status: number; data?: { result?: Post; message?: string } }> {
    return this.vote(postID, -1);
  }

  /**
   * Upvote a given post.
   * @param userID - The user voting.
   * @param postID - The post to upvote.
   * @returns A status object indivating whether the post was upvoted.
   */
  async upVote(
    userID: string,
    postID: string
  ): Promise<{ status: number; data?: { result?: Post; message?: string } }> {
    const result = await this.userPostLikesRepo.likePost(userID, postID);
    if (result) {
      return { status: 204 };
    }
    return {
      status: 500,
      data: { message: `Could not like the post: ${postID}` },
    };
  }

  /**
   * Downvote a post.
   *
   * @param userID  - The user voting.
   * @param postID  - the post being voted on
   * @returns A status object with the result.
   */
  async downVote(
    userID: string,
    postID: string
  ): Promise<{ status: number; data?: { result?: Post; message?: string } }> {
    const result = await this.userPostLikesRepo.unlikePost(userID, postID);
    if (result) {
      return { status: 204 };
    }
    return {
      status: 500,
      data: { message: `Could not unlike the post: ${postID}` },
    };
  }

  /**
   * @returns Create a new post and return it.
   */
  async createPost(
    userID: string,
    title?: string,
    body?: string,
    location?: string,
    capacity?: number
  ): Promise<{ status: number; data: { result?: Post; message?: string } }> {
    if (!title || !body || !location || capacity == undefined) {
      return { status: 400, data: { message: 'Missing fields.' } };
    }

    const post = await this.postsRepo.create({
      title: title,
      body: body,
      location: location,
      capacity: capacity,
      UserId: userID,
    });

    if (!post) {
      return {
        status: 500,
        data: { message: 'Could not create the new post' },
      };
    }

    return { status: 200, data: { result: post } };
  }

  /**
   * Update the post by ID.
   * @returns A result object indicating whether the update was successful, with the updated post if
   * it was updated.
   */
  async updatePost(
    currentUserId: string,
    postID: string,
    title?: string,
    body?: string,
    location?: string,
    capacity?: number
  ): Promise<{ status: number; data?: { message?: string; result?: Post } }> {
    const post = await this.postsRepo.findByPk(postID);

    if (post && post.UserId == currentUserId) {
      try {
        post.title = title || post.title;
        post.body = body || post.body;
        post.location = location || post.location;
        post.capacity = capacity || post.capacity;
        await post.save();
        return { status: 200, data: { result: post } };
      } catch (err) {
        console.error(`Could not update post ${postID}\n`, err);
        return { status: 500, data: { message: 'Could not update the post.' } };
      }
    } else if (post) {
      return {
        status: 401,
        data: { message: 'Not authorized to edit this post.' },
      };
    }
    return { status: 404, data: { message: 'Could not find post.' } };
  }
}
