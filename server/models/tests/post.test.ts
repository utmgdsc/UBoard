import {
  makeUser,
  makePost,
  dbSync,
  getAllTags,
  getPostTags,
  makePostWithTags,
} from './testHelpers';

beforeEach(async () => {
  await dbSync().catch((err) => fail(err));
});

describe('Post Model', () => {
  describe('Post Creation', () => {
    test('Create a basic post and check the validity of the database entry', async () => {
      const author = await makeUser('postTester', 'poster@mail.utoronto.ca');
      expect(author).toBeDefined();

      expect(author.userName).toContain('postTester');
      const coord = { lat: 34.123913028321, lng: -96.123913028321 };

      const posted = await makePost(
        author.id,
        'This is a new post!',
        'Woooo new post new post abcdefghhi!!',
        coord
      );

      expect(posted).toBeDefined();

      expect(posted.UserId).toEqual(author.id);
      expect(posted.body).toEqual('Woooo new post new post abcdefghhi!!');
      expect(posted.title).toEqual('This is a new post!');
      expect(posted.coords).toEqual(coord);
    });

    test('Create a post with no coordinates specified', async () => {
      const author = await makeUser('postTester', 'poster@mail.utoronto.ca');
      expect(author).toBeDefined();

      expect(author.userName).toContain('postTester');

      const posted = await makePost(
        author.id,
        'This is a new post!',
        'Woooo new post new post abcdefghhi!!'
      );

      expect(posted).toBeDefined();

      expect(posted.UserId).toEqual(author.id);
      expect(posted.body).toEqual('Woooo new post new post abcdefghhi!!');
      expect(posted.title).toEqual('This is a new post!');
      expect(posted.coords).toEqual({ lat: -1, lng: -1 });
    });
  });

  describe('Post Validation', () => {
    test('Attempt to make posts with invalid or empty author', async () => {
      await expect(
        makePost('', 'asd', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      ).rejects.toThrowError(
        'Validation error: Validation notEmpty on UserId failed'
      ); // NULL author

      await expect(
        makePost('123123', 'asdddd', 'Woooo attempting new post abcdefghhi!!')
      ).rejects.toThrowError('SQLITE_CONSTRAINT'); // Non-existant uid
    });

    test('Attempt to make post that is too short', async () => {
      const badAuthor = await makeUser('Hello123', 'asadad@utoronto.ca');

      await expect(
        makePost(badAuthor.id, 'Short post', 'a')
      ).rejects.toThrowError('Validation error: Length Validation Failed');
    });
  });

  describe('Post Tags', () => {
    it('should be able to use existing tags', async () => {
      const author = await makeUser('postTester', 'poster@mail.utoronto.ca');
      const tags = ['csc108', 'bananaPepper'];

      await makePostWithTags(author.id, tags);

      expect((await getAllTags()).length).toBe(tags.length);
      const result = await makePostWithTags(author.id, tags);

      const postTags = await getPostTags(result.id);
      expect(postTags!.map((t) => t.text).sort()).toEqual(tags.sort());
      expect((await getAllTags()).length).toBe(tags.length);
    });
  });
});
