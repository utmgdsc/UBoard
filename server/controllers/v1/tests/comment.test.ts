import db from '../../../models';
import {
  dbSync,
  makeUser,
  makeValidComment,
  makeValidPost,
  makeValidUser,
} from '../../../models/tests/testHelpers';
import CommentController from '../comment';

const commentController = new CommentController(db.Comment);

beforeEach(async () => {
  await dbSync().catch((err) => fail(err));
});

describe('Test v1 - Comment Controller', () => {
  describe('test comment fetching', () => {
    it('should return a list of comments', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const comments = [
        await makeValidComment(author.id, post.id),
        await makeValidComment(author.id, post.id),
      ];

      const result = await commentController.getComments(post.id, 100, 0);

      expect(result.status).toBe(200);
      expect(result.data.result![0].id).toBe(comments[0].id);
      expect(result.data.result![1].id).toBe(comments[1].id);
      expect(result.data.result![0].User.firstName).toBe(author.firstName);
      expect(result.data.total).toBe(2);
    });

    it('should return an error for a missing post', async () => {
      const result = await commentController.getComment('123');
      expect(result.status).toBe(404);
    });
  });

  describe('test comment creation', () => {
    it('should create a new comment wiht valid parameters', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const result = await commentController.createComment(
        'This is a new comment!This is a new comment!!',
        author.id,
        post.id
      );

      expect(result.status).toBe(200);
    });

    it('shoudl error on missing parameters', async () => {
      const author = await makeValidUser();
      const result = await commentController.createComment(
        'This is a new comment!This is a new comment!!',
        author.id,
        undefined
      );
      expect(result.status).toBe(400);
    });
  });

  describe('post mutation', () => {
    it('should update the comment body', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const comment = await makeValidComment(author.id, post.id);
      const newBody = 'This is a NEW UPDATED body';

      const result = await commentController.updateComment(
        author.id,
        comment.id,
        newBody
      );

      expect(result.status).toBe(200);
      expect(result.data!.result!.body).toBe(newBody);
    });

    it('should not update the comment for invalid user', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const comment = await makeValidComment(author.id, post.id);
      const newBody = 'This is a NEW UPDATED body';

      const badUser = await makeUser('bad', 'bad@mail.utoronto.ca');

      const result = await commentController.updateComment(
        badUser.id,
        comment.id,
        newBody
      );

      expect(result.status).toBe(401);
    });

    it('should delete an existing comment', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const comment = await makeValidComment(author.id, post.id);

      const result = await commentController.deleteComment(
        author.id,
        comment.id
      );
      expect(result.status).toBe(204);

      const findResult = await commentController.getComment(comment.id);
      expect(findResult).toBe(404);
    });

    it('shouldnt not delete a different comment', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);
      const comment = await makeValidComment(author.id, post.id);

      const badUser = await makeUser('bad', 'bad@mail.utoronto.ca');
      const result = await commentController.deleteComment(
        badUser.id,
        comment.id
      );
      expect(result.status).toBe(401);

      const findResult = await commentController.getComment(comment.id);
      expect(findResult.status).toBe(200);
    });

    it('should error for deleteing an invalid comment', async () => {
      const author = await makeValidUser();
      const result = await commentController.deleteComment(author.id, '123');
      expect(result.status).toBe(404);
    });

    it('deleting a comment is reflected on the total count returned by getComments', async () => {
      const author = await makeValidUser();
      const post = await makeValidPost(author.id);

      const comments = [
        await makeValidComment(author.id, post.id),
        await makeValidComment(author.id, post.id),
      ];

      expect(
        (await commentController.deleteComment(author.id, comments[0].id))
          .status
      ).toBe(204);

      const result = await commentController.getComments(post.id, 100, 0);
      expect(result.data.total).toBe(1);
    });
  });
});
