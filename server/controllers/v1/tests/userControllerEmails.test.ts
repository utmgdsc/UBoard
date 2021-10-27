import db from "../../../models";
import { dbSync, makeUser } from "../../../models/tests/testHelpers";
import { User } from "../../../models/user";
import EmailService, { EMAIL_TYPE } from "../../../services/emailService";
import UserController from "../user";
jest.mock("../../../services/emailService"); // see __mock__/emailService

let testPers1: User;
let uContr: UserController;
let eServ: EmailService;

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));

  eServ = new EmailService();
  uContr = new UserController(db.User, "", eServ);
});

describe("Testing the token functions", () => {
  describe("Authorized token usage", () => {
    let rawToken: string;
    test("Generating a CONF token properly updates User entry", async () => {
      testPers1 = await makeUser("constPers1", "lol@utoronto.ca"); // initial test user
      expect(testPers1).toBeDefined();

      if (!testPers1) fail("nullperson"); // required to appease TS

      expect(testPers1.confirmed).toBeFalsy();
      const status = await uContr.sendEmailConfirmation(testPers1);

      expect(status).toBeTruthy();
      expect(testPers1.confirmationToken).toContain(EMAIL_TYPE.CONF);

      const curr = new Date().getTime(); // check expiry
      expect(testPers1.confirmationTokenExpires.getTime()).toBeGreaterThan(
        curr
      );

      rawToken = testPers1.confirmationToken;
      rawToken = rawToken.substring(rawToken.indexOf(":") + 1); // ignore the type part of "type:<token>"
    });

    test("confirmEmail to validate our user. Ensure token is consumed", async () => {
      const status: boolean = await uContr.confirmEmail(rawToken);
      testPers1 = await db.User.findOne({ where: { email: testPers1.email } });
      console.log(testPers1);
      expect(status).toBeTruthy();
      expect(testPers1.confirmed).toBeTruthy();
      expect(testPers1.confirmationToken).toHaveLength(0);
      expect(testPers1.confirmationTokenExpires).toBeNull();
    });

    test("Attempt to use an invalid token", async () => {
      await expect(uContr.confirmEmail(rawToken)).resolves.toBeFalsy();

      await expect(uContr.resetPassword(rawToken, "", "")).resolves.toBeFalsy();
    });
  });
});
