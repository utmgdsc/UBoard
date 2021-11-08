import {Post} from '../../models/post';

// The maximum number of results to return.
const MAX_RESULTS = 50;

export default class PostController {
  protected postsRepo: typeof Post;

  constructor(postsRepo: typeof Post) {
    this.postsRepo = postsRepo;
  }

  /**
   * CRUD method to get all the posts.
   *
   * @param limit - Limit the posts to a number of results.
   * @param offset - Offset the results
   * @returns A data object containing the results.
   */
  async getPosts(
    limit: number,
    offset: number
  ): Promise<{status: number; data: {result?: Post[]; count: number}}> {
    const data = await this.postsRepo.findAndCountAll({
      limit: limit > MAX_RESULTS ? MAX_RESULTS : limit,
      // Since we are returning multiple results, we want to limit the data. This data will be shown
      // in a list, so ignoring body is ok as it won't be displayed anyway.
      attributes: ['id', 'title', 'feedbackScore', 'createdAt'],
      order: [['createdAt', 'DESC']],
      offset: offset,
    });

    return {status: data.count > 0 ? 200 : 204, data: {result: data.rows, count: data.count}};
  }

  /**
   * Search for the post by the given ID if it exists.
   *
   * @param postID - The identifier used to find the specific post.
   * @returns The details of the post
   */
  async getPost(
    postID: string
  ): Promise<{status: number; data: {result?: Post; message?: string}}> {
    const data = await this.postsRepo.findByPk(postID);

    if (!data) {
      return {
        status: 404,
        data: {message: `Post ${postID} could not be found`},
      };
    }
    return {
      status: 200,
      data: {result: data},
    };
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
  ): Promise<{status: number; data?: {message?: string}}> {
    const result = await this.postsRepo.findOne({where: {id: postID}});

    if (!result) {
      return {status: 404, data: {message: `Post ${postID} could not be deleted.`}};
    } else if (result.UserId != userId) {
      return {status: 401, data: {message: 'Unauthorized to delete the post.'}};
    }
    await result.destroy();
    return {status: 204};
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
  ): Promise<{status: number; data?: {result?: Post; message?: string}}> {
    // TODO: We should track which users voted and how frequently, and take action to prevent vote
    // spamming.
    const data = await this.getPost(postID);

    if (data.status != 200) {
      return data;
    }

    try {
      (data.data.result!.feedbackScore as number) += amount;
      await data.data.result!.save();
      return {status: 204, data: {result: data.data.result}};
    } catch (err) {
      console.error(`Could not change vote for: ${postID}`);
      return {
        status: 400,
        data: {message: `Could not ${amount == 1 ? 'upvote' : 'report'} post: ${postID}`},
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
  ): Promise<{status: number; data?: {result?: Post; message?: string}}> {
    return this.vote(postID, -1);
  }

  /**
   * Upvote a given post.
   * @param postID - The post to upvote.
   * @returns A status object indivating whether the post was upvoted.
   */
  async upVote(
    postID: string
  ): Promise<{status: number; data?: {result?: Post; message?: string}}> {
    return this.vote(postID, 1);
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
  ): Promise<{status: number; data: {result?: Post; message?: string}}> {
    if (!title || !body || !location || !capacity) {
      return {status: 400, data: {message: 'Missing fields.'}};
    }

    const post = await this.postsRepo.create({
      title: title,
      body: body,
      location: location,
      capacity: capacity,
      UserId: userID,
    });

    if (!post) {
      return {status: 500, data: {message: 'Could not create the new post'}};
    }

    return {status: 200, data: {result: post}};
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
  ): Promise<{status: number; data?: {message?: string; result?: Post}}> {
    const post = (await this.getPost(postID)).data.result;

    if (post && post.UserId == currentUserId) {
      try {
        post.title = title || post.title;
        post.body = body || post.body;
        post.location = location || post.location;
        post.capacity = capacity || post.capacity;
        await post.save();
        return {status: 200, data: {result: post}};
      } catch (err) {
        console.error(`Could not update post ${postID}\n`, err);
        return {status: 500, data: {message: 'Could not update the post.'}};
      }
    } else if (post) {
      return {status: 401, data: {message: 'Not authorized to edit this post.'}};
    }
    return {status: 404, data: {message: 'Could not find post.'}};
  }
}
