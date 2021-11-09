import db from '../../../models';
import {dbSync, makeUser, makeValidPost, makeValidUser} from '../../../models/tests/testHelpers';
import PostController from '../post';

const postController = new PostController(db.Post);

beforeEach(async () => {
  await dbSync().catch(err => fail(err));
});

describe('Test v1 - Post Controller', () => {
  describe('test post fecthing', () => {
    it('should return a list of posts', async () => {
      const author = await makeValidUser();
      const posts = [await makeValidPost(author.id), await makeValidPost(author.id)];

      const result = await postController.getPosts(100, 0);

      expect(result.status).toBe(200);
      expect(result.data.count).toBe(2);
      expect(result.data.result![0].id).toBe(posts[1].id);
      expect(result.data.result![1].id).toBe(posts[0].id);
    });

    it('should return valid post details', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const result = await postController.getPost(post.id);

      expect(result.status).toBe(200);
      expect(result.data.result?.body).toBe(post.body);
    });

    it('should return an error for a missing post', async () => {
      const result = await postController.getPost('123-123-123');

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

      const result = await postController.updatePost(author.id, post.id, newTitle);

      expect(result.status).toBe(200);
      expect(result.data!.result!.title).toBe(newTitle);
    });
    it('should not update the post for invalid user', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const oldTitle = post.title;
      const newTitle = 'A different post title!';

      const badUser = await makeUser('bad', 'bad@mail.utoronto.ca');

      const result = await postController.updatePost(badUser.id, post.id, newTitle);

      expect(result.status).toBe(401);
    });

    it('should delete an existing post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const result = await postController.deletePost(author.id, post.id);
      expect(result.status).toBe(204);

      const findResult = await postController.getPost(post.id);
      expect(findResult.status).toBe(404);
    });

    it('should not delete a different post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const badUser = await makeUser('bad', 'bad@mail.utoronto.ca');

      const result = await postController.deletePost(badUser.id, post.id);
      expect(result.status).toBe(401);

      const findResult = await postController.getPost(post.id);
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

      const result = await postController.upVote(post.id);

      expect(result.status).toBe(204);
      await post.reload();
      expect(post.feedbackScore).toBe(11);
    });

    it('should report a post', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const result = await postController.report(post.id);

      expect(result.status).toBe(204);
      await post.reload();
      expect(post.feedbackScore).toBe(9);
    });
  });
});
