import db from '../../../models';
import {
  dbSync,
  getAllTags,
  getPostTags,
  makeUser,
  makeValidPost,
  makeValidUser,
} from '../../../models/tests/testHelpers';
import PostController from '../post';

const postController = new PostController(db.Post, db.UserPostLikes, db.Tag);

beforeEach(async () => {
  await dbSync().catch((err) => fail(err));
});

describe('Test v1 - Post Controller', () => {
  describe('test post fecthing', () => {
    it('should return a list of posts', async () => {
      const author = await makeValidUser();
      const posts = [
        await makeValidPost(author.id),
        await makeValidPost(author.id),
      ];
      await db.UserPostLikes.likePost(author.id, posts[0].id);

      const result = await postController.getPosts(author.id, 100, 0);

      expect(result.status).toBe(200);
      expect(result.data.count).toBe(2);
      expect(result.data.result![0].id).toBe(posts[1].id);
      expect(result.data.result![1].id).toBe(posts[0].id);
      expect(result.data.result![1].User.firstName).toBe(author.firstName);
      expect(result.data.total).toBe(2);
      expect(result.data.result![1].likeCount).toEqual(1);
      expect(result.data.result![1].doesUserLike).toBeTruthy();
      expect(result.data.result![0].doesUserLike).toBeFalsy();
    });

    it('should return valid post details', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      await db.UserPostLikes.likePost(author.id, post.id);

      const result = await postController.getPost(author.id, post.id);

      expect(result.status).toBe(200);
      expect(result.data.result?.body).toBe(post.body);
      expect(result.data.result?.User.lastName).toBe(author.lastName);
      expect(result.data.result?.likeCount).toBe(1);
      expect(result.data.result?.doesUserLike).toBeTruthy();
      expect(result.data.result?.Tags.length).toBe(0);
    });

    it('should return an error for a missing post', async () => {
      const result = await postController.getPost('123-123-123', '123-123-123');

      expect(result.status).toBe(404);
    });
  });

  describe('test post creation', () => {
    it('should create a new post with valid parameters', async () => {
      const author = await makeValidUser();

      const result = await postController.createPost(
        author.id,
        'This is a new post!',
        'This is a new post!This is a new post!',
        'location',
        10
      );
      expect(result.status).toBe(200);
    });

    it('should allow creating new tags when making a post', async () => {
      const author = await makeValidUser();
      const tags = ['csc108', 'bananaPepper'];

      const result = await postController.createPost(
        author.id,
        'This is a new post!',
        'This is a new post!This is a new post!',
        'location',
        10,
        tags
      );

      const postTags = await getPostTags(result.data.result!.id);
      expect(postTags?.map((t) => t.text).sort()).toEqual(tags.sort());

      expect(result.status).toBe(200);
    });

    it('should be able to use one existing tag, and one new tag', async () => {
      const author = await makeValidUser();
      const tags = ['csc108'];

      await postController.createPost(
        author.id,
        'This is a new post!',
        'This is a new post!This is a new post!',
        'location',
        10,
        tags
      );

      const newTag = [...tags, 'new'];
      const result = await postController.createPost(
        author.id,
        'This is another post!',
        'This is a new post!This is a new post2!',
        'location',
        44,
        newTag
      );

      expect(
        (await getPostTags(result.data.result!.id))?.map((t) => t.text).sort()
      ).toEqual(newTag.sort());
    });

    it('getting a post will include the associated tags', async () => {
      const author = await makeValidUser();
      const tags = ['csc108', 'bananaPepper'];

      const result = await postController.createPost(
        author.id,
        'This is a new post!',
        'This is a new post!This is a new post!',
        'location',
        10,
        tags
      );

      expect(result.status).toBe(200);

      const post = await postController.getPost(
        author.id,
        result.data.result!.id
      );
      expect(post.data.result?.Tags?.map((t) => t.text).sort()).toEqual(
        tags.sort()
      );
    });

    it('getting a post will include the location and coordinates', async () => {
      const author = await makeValidUser();
      const coords = {
        lat: 59.321312903128301289,
        lng: -94.2312903128312901212,
      };
      const result = await postController.createPost(
        author.id,
        'This is a new post!',
        'This is a new post!This is a new post!',
        'location',
        10,
        [],
        coords
      );

      expect(result.status).toBe(200);

      const post = await postController.getPost(
        author.id,
        result.data.result!.id
      );
      expect(post.data.result?.coords).toEqual(coords);
    });

    it('should error on missing parameters', async () => {
      const author = await makeValidUser();

      const result = await postController.createPost(
        author.id,
        undefined,
        'This is a new post!This is a new post!!',
        'location',
        10
      );
      expect(result.status).toBe(400);
    });
  });

  describe('post mutation', () => {
    it('should update the post title with other values null', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const newTitle = 'A different post title!';

      const result = await postController.updatePost(
        author.id,
        post.id,
        newTitle
      );

      expect(result.status).toBe(200);
      expect(result.data!.result!.title).toBe(newTitle);
    });

    it('should not update the post for invalid user', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const oldTitle = post.title;
      const newTitle = 'A different post title!';

      const badUser = await makeUser('bad', 'bad@mail.utoronto.ca');

      const result = await postController.updatePost(
        badUser.id,
        post.id,
        newTitle
      );

      expect(result.status).toBe(401);
    });

    it('should delete an existing post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const result = await postController.deletePost(author.id, post.id);
      expect(result.status).toBe(204);

      const findResult = await postController.getPost(author.id, post.id);
      expect(findResult.status).toBe(404);
    });

    it('deleting a post does not delete tags', async () => {
      const author = await makeValidUser();
      const tags = ['csc108'];

      const deleted = await postController.createPost(
        author.id,
        'This is a new post!',
        'This is a new post!This is a new post!',
        'location',
        10,
        tags
      );

      const result = await postController.createPost(
        author.id,
        'This is a new post!',
        'This is a new post!This is a new post!',
        'location',
        10,
        tags
      );

      await postController.deletePost(author.id, deleted.data.result!.id);

      expect(result.status).toBe(200);

      const post = await postController.getPost(
        author.id!,
        result.data.result!.id
      );
      expect(post.data.result?.Tags?.map((t) => t.text)).toEqual(tags);

      expect((await getAllTags()).length).toBe(1);
    });

    it('should not delete a different post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const badUser = await makeUser('bad', 'bad@mail.utoronto.ca');

      const result = await postController.deletePost(badUser.id, post.id);
      expect(result.status).toBe(401);

      const findResult = await postController.getPost(author.id, post.id);
      expect(findResult.status).toBe(200);
    });

    it('should error deleting an invalid post', async () => {
      const author = await makeValidUser();
      const result = await postController.deletePost(author.id, '123-123-123');
      expect(result.status).toBe(404);
    });

    it('should upvote a post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const result = await postController.upVote(author.id, post.id);

      expect(result.status).toBe(204);

      expect(await db.UserPostLikes.getLikeCount(post.id)).toBe(1);
    });

    it('should not allow multiple upvotes on a post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      await postController.upVote(author.id, post.id);
      const result = await postController.upVote(author.id, post.id);

      expect(result.status).toBe(204);

      expect(await db.UserPostLikes.getLikeCount(post.id)).toBe(1);
    });

    it('should downvote a post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      await postController.upVote(author.id, post.id);
      expect(await db.UserPostLikes.getLikeCount(post.id)).toBe(1);

      await postController.downVote(author.id, post.id);
      expect(await db.UserPostLikes.getLikeCount(post.id)).toBe(0);
    });

    it('should not downvote if user has not voted', async () => {
      const author = await makeValidUser();
      const voter = await makeUser('voter', 'voter@mail.utoronto.ca');
      const post = await makeValidPost(author.id);

      await postController.upVote(voter.id, post.id);
      const result = await postController.downVote(author.id, post.id);

      expect(result.status).toBe(500);

      expect(await db.UserPostLikes.getLikeCount(post.id)).toBe(1);
    });

    it('should report a post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const result = await postController.report(post.id);

      expect(result.status).toBe(204);
      await post.reload();
      expect(post.feedbackScore).toBe(9);
    });

    it('deleting a post is reflected on the total count returned by getposts', async () => {
      const author = await makeValidUser();
      const posts = [
        await makeValidPost(author.id),
        await makeValidPost(author.id),
      ];
      expect(
        (await postController.deletePost(author.id, posts[0].id)).status
      ).toBe(204);

      const result = await postController.getPosts(author.id, 100, 0);

      expect(result.data.total).toBe(1);
    });
  });
});
