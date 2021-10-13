import {makeUser, makePost, dbSync} from './testHelpers'

dbSync()

test("Attempt to make posts with invalid or empty author", async() => {
    await expect(makePost(null, "asd", "aaaaaaaaa")).rejects.toThrowError("notNull Violation"); // NULL author

    await expect(makePost("123123", "asdddd", "AAAA")).rejects.toThrowError("SQLITE_CONSTRAINT"); // Non-existant uid

});

test("Create a basic post and check the validity of the database entry", async () => {
    const author = await makeUser("postTester", "poster@mail.utoronto.ca");
    expect(author).toBeDefined();

    expect(author.userName).toContain("postTester")

    const posted = await makePost(author.id, "This is a new post!", "Woooo!!");

    expect(posted).toBeDefined();

    expect(posted.UserId).toEqual(author.id);
    expect(posted.body).toEqual("Woooo!!")
    expect(posted.title).toEqual("This is a new post!")

});