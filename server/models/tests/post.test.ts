import { makeUser, makePost, dbSync } from "./testHelpers";

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));
});

describe("Post Model", () => {
  describe("Post Creation", () => {
    test("Create a basic post and check the validity of the database entry", async () => {
      const author = await makeUser("postTester", "poster@mail.utoronto.ca");
      expect(author).toBeDefined();

      expect(author.userName).toContain("postTester");

      const posted = await makePost(
        author.id,
        "This is a new post!",
        "Woooo new post new post abcdefghhi!!"
      );

      expect(posted).toBeDefined();

      expect(posted.UserId).toEqual(author.id);
      expect(posted.body).toEqual("Woooo new post new post abcdefghhi!!");
      expect(posted.title).toEqual("This is a new post!");
    });
  });

  describe("Post Validation", () => {
    test("Attempt to make posts with invalid or empty author", async () => {
      await expect(makePost(null, "asd", "aaaaaaaaa")).rejects.toThrowError(
        "notNull Violation"
      ); // NULL author

      await expect(
        makePost("123123", "asdddd", "Woooo attempting new post abcdefghhi!!")
      ).rejects.toThrowError("SQLITE_CONSTRAINT"); // Non-existant uid
    });

    test("Attempt to make post that is too short", async () => {
      const badAuthor = await makeUser("Hello123", "asadad@utoronto.ca");

      await expect(
        makePost(badAuthor.id, "Short post", "a")
      ).rejects.toThrowError("Validation error: Length Validation Failed");
    });
  });
});
