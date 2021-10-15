import { makeUser, dbSync } from "./testHelpers";
import db from "../index";
import { User } from "../user";

const UserModel: typeof User = db.User;

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));
});

describe("User Model ", () => {
  describe("User Creation", () => {
    test("Create basic users with valid name and email", async () => {
      await expect(
        makeUser("testPerson1", "testmail1@mail.utoronto.ca")
      ).resolves.toBeDefined();
      await expect(
        makeUser("testPerson2", "testmail2@utoronto.ca")
      ).resolves.toBeDefined();
      await expect(
        makeUser("testPerson3", "testmail3@alum.utoronto.ca")
      ).resolves.toBeDefined();

      /* Query to see if anything was inserted */
      const testPers1 = await UserModel.findOne({
        where: {
          userName: "testPerson1",
        },
      });

      if (testPers1 === null)
        // to appease typescript
        fail();

      expect(testPers1.email).toContain("testmail1");
      expect(testPers1.userName).toEqual("testPerson1");
    });
  });

  describe("User Validation", () => {
    test("Attempt to create Users with invalid emails", async () => {
      await expect(
        makeUser("rejectedPerson1", "lol@gmail.com")
      ).rejects.toThrowError("Validation error");
      await expect(
        makeUser("rejectedPerson2", "@utoronto.ca")
      ).rejects.toThrowError("Validation error");
      await expect(
        makeUser("rejectedPerson3", "lol@gmailutoronto.ca")
      ).rejects.toThrowError("Validation error");
    });

    test("Ensure email is forced to lowercase in the database", async () => {
      const usr = await makeUser("testing1234", "EMAILTESTING@UToroNTO.ca");

      expect(usr).toBeDefined();

      expect(usr.email).toEqual("emailtesting@utoronto.ca");
    });

    test("Attempt to create two users with the same email", async () => {
      await expect(
        makeUser("acceptedPerson1", "lol@utoronto.ca")
      ).resolves.toBeDefined();
      await expect(
        makeUser("rejectedPerson1", "LOL@utoronto.ca")
      ).rejects.toThrowError("Validation error");
    });

    test("Attempt to create two users with the same name", async () => {
      await expect(
        makeUser("personabc", "emails@utoronto.ca")
      ).resolves.toBeDefined();
      await expect(
        makeUser("personabc", "lo22l@utoronto.ca")
      ).rejects.toThrowError("Validation error");
    });
  });
});
