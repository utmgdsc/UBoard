import argon2 from "argon2";
import db from "../../../models";
import { dbSync, makeUser } from "../../../models/tests/testHelpers";
import { User } from "../../../models/user";
import UserController, { TOKEN_TYPE } from "../user";
import EmailService from "../../../services/emailService";

/* Setup mock email service */
const fakeSendConfirmEmail = jest.fn(() => true);
const fakeSendResetEmail = jest.fn(() => true);
jest.mock("../../../services/emailService", () => {
  return jest.fn().mockImplementation(() => {
    return {
      sendConfirmEmail: fakeSendConfirmEmail,
      sendResetEmail: fakeSendResetEmail,
    };
  });
});

const EmailServiceMock = EmailService as jest.MockedClass<any>;
let testPerson: User;
let uContr: UserController;

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));
  uContr = new UserController(db.User, "", new EmailServiceMock());
});

beforeEach(async () => {
  EmailServiceMock.mockClear();
  fakeSendConfirmEmail.mockClear();
  fakeSendResetEmail.mockClear();
});

describe("Test v1 - User Controller", () => {
  let rawToken: string;
  describe("Email Confirmations", () => {
    test("Generating CONF properly updates User entry", async () => {
      testPerson = await makeUser("constPers1", "lol@utoronto.ca"); // initial test user

      if (!testPerson) {
        fail("nullperson"); // required to appease TS
      }
      expect(testPerson.confirmed).toBeFalsy();
      const status = await uContr.sendEmailConfirmation(testPerson.email);
      await testPerson.reload(); // refresh data from db
      rawToken = testPerson.confirmationToken;
      rawToken = rawToken.substring(rawToken.indexOf(":") + 1); // ignore the type part of "type:<token>"

      // Service functions called properly
      expect(fakeSendConfirmEmail).toBeCalledTimes(1);
      expect(fakeSendResetEmail).toBeCalledTimes(0);
      expect(fakeSendConfirmEmail.mock.calls[0]).toEqual([
        rawToken,
        testPerson.firstName,
        testPerson.lastName,
        testPerson.email,
      ]);

      expect(status).toBeTruthy();
      expect(testPerson.confirmationToken).toContain(TOKEN_TYPE.CONF);
      const curr = new Date().getTime(); // check expiry
      expect(testPerson.confirmationTokenExpires.getTime()).toBeGreaterThan(
        curr
      );
    });

    test("Ensure the conf token cannot be used for password reset", async () => {
      await expect(uContr.resetPassword(rawToken, "", "")).resolves.toBeFalsy();
    });

    test("Consume token and confirm the user account", async () => {
      const status: boolean = await uContr.confirmEmail(rawToken);
      expect(status).toBeTruthy();
      await testPerson.reload();
      expect(testPerson.confirmed).toBeTruthy();
      expect(testPerson.confirmationToken).toHaveLength(0);
      expect(testPerson.confirmationTokenExpires).toBeNull();
    });

    test("Ensure the token cannot be used again", async () => {
      await expect(uContr.confirmEmail(rawToken)).resolves.toBeFalsy();
    });
  });

  describe("Password Resets", () => {
    test("Generating password reset updates the user entry", async () => {
      testPerson = await makeUser("constPers2", "lol2@utoronto.ca");
      expect(testPerson).toBeDefined();

      if (!testPerson) {
        fail("nullperson");
      }

      expect(testPerson.confirmed).toBeFalsy();
      const status = await uContr.sendResetEmail(testPerson.email);
      await testPerson.reload();
      rawToken = testPerson.confirmationToken;
      rawToken = rawToken.substring(rawToken.indexOf(":") + 1); // ignore the type part of "type:<token>"

      expect(fakeSendConfirmEmail).toBeCalledTimes(0);
      expect(fakeSendResetEmail).toBeCalledTimes(1);
      expect(fakeSendResetEmail.mock.calls[0]).toEqual([
        rawToken,
        testPerson.firstName,
        testPerson.lastName,
        testPerson.userName,
        testPerson.email,
      ]);

      expect(status).toBeTruthy();
      expect(testPerson.confirmationToken).toContain(TOKEN_TYPE.RESET);

      const curr = new Date().getTime(); // check expiry
      expect(testPerson.confirmationTokenExpires.getTime()).toBeGreaterThan(
        curr
      );
    });

    test("Ensure the reset token cannot be used for confirmations", async () => {
      await expect(uContr.confirmEmail(rawToken)).resolves.toBeFalsy();
    });

    test("Ensure nothing happens if the new password is invalid", async () => {
      const pass = testPerson.password;
      const status: boolean = await uContr.resetPassword(rawToken, "abc", "vv");
      expect(status).toBeFalsy();
      await testPerson.reload();
      expect(testPerson.password).toEqual(pass);
      expect(testPerson.confirmationToken).not.toHaveLength(0);
      expect(testPerson.confirmationTokenExpires).not.toBeNull();
    });

    test("Ensure token is consumed and new password is set", async () => {
      const status: boolean = await uContr.resetPassword(
        rawToken,
        "newPassword",
        "newPassword"
      );
      expect(status).toBeTruthy();
      await testPerson.reload();
      const check = await argon2.verify(testPerson.password, "newPassword");

      expect(check).toBeTruthy();
      expect(testPerson.confirmationToken).toHaveLength(0);
      expect(testPerson.confirmationTokenExpires).toBeNull();
    });
  });
});
