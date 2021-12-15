import db from '../index';
import { dbSync, makeUser, makeValidUser, makeValidPost } from './testHelpers';
import { UserPostLikes } from '../userPostLikes';

const model: typeof UserPostLikes = db.UserPostLikes;

beforeEach(async () => {
  await dbSync();
});

describe('UserPostLikes model (associates a users like with a post', () => {
  describe('liking a post', () => {
    it('should like a post and associate user with post', async () => {
      const user = await makeValidUser();
      const post = await makeValidPost(user.id);

      await model.likePost(user.id, post.id);

      expect(model.doesLikePost(user.id, post.id)).toBeTruthy();
    });

    it('should unlike a post and disassociate a user with a post', async () => {
      // it should only disassociate to one model we requested, not all.
      const firstUser = await makeUser('firstUser', 'first@mail.utoronto.ca');
      const firstPost = await makeValidPost(firstUser.id);
      const user = await makeValidUser();
      const post = await makeValidPost(user.id);

      await model.likePost(firstUser.id, firstPost.id);
      await model.likePost(user.id, post.id);
      await model.unlikePost(user.id, post.id);

      expect(await model.doesLikePost(user.id, post.id)).toBeFalsy();
    });

    it('should return the correct like count for a post after like then unlike', async () => {
      const firstUser = await makeUser('firstUser', 'first@mail.utoronto.ca');
      const user = await makeValidUser();
      const post = await makeValidPost(user.id);

      await model.likePost(user.id, post.id);
      await model.likePost(firstUser.id, post.id);
      expect(await model.getLikeCount(post.id)).toEqual(2);

      await model.unlikePost(user.id, post.id);
      expect(await model.getLikeCount(post.id)).toEqual(1);
    });
  });
});
