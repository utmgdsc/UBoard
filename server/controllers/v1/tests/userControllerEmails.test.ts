import db from "../../../models";
import { dbSync, makeUser } from "../../../models/tests/testHelpers";
import { User } from "../../../models/user";
import EmailService, { EMAIL_TYPE } from "../../../services/emailService";
import UserController from "../user";

let testPers1: User;
let eServ: EmailService;
let uContr: UserController;

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));
  eServ = new EmailService();
  uContr = new UserController(db.User, "jwt_secret", eServ);
});

describe("Testing the token functions", () => {
  describe("Authorized token usage", () => {
    let rawToken: string;
    test("Generating a token properly updates User entry", async () => {
      testPers1 = await makeUser("constPers1", "lol@utoronto.ca"); // initial test user
      expect(testPers1).toBeDefined();

      if (!testPers1) fail("nullperson"); // required to appease TS

      expect(testPers1.confirmed).toBeFalsy();
      const status = await uContr.generateToken(
        testPers1,
        EMAIL_TYPE.CONF,
        false // do not send email
      );
      expect(status).toBeTruthy();
      expect(testPers1.confirmationToken).toContain(EMAIL_TYPE.CONF);

      const curr = new Date().getTime();
      expect(testPers1.confirmationTokenExpires.getTime()).toBeGreaterThan(
        curr
      );
    }); /* End Test 1 */

    test("validateToken on what was just made", async () => {
      rawToken = testPers1.confirmationToken.substring(
        // token in our DB is different from how it is shown to the user
        testPers1.confirmationToken.indexOf(":") + 1
      );
      await expect(
        uContr.validateToken(rawToken, EMAIL_TYPE.CONF, testPers1.email)
      ).resolves.toBeTruthy();
    });

    test("confirmEmail to validate our user. Ensure token is consumed", async () => {
      const status: boolean = await uContr.confirmEmail(
        rawToken,
        testPers1.email
      );
      testPers1 = await db.User.findOne({ where: { email: testPers1.email } });

      expect(status).toBeTruthy();
      expect(testPers1.confirmed).toBeTruthy();
      expect(testPers1.confirmationToken).toHaveLength(0);
    });

    test("Attempt to use an invalid token", async () => {
      await expect(
        uContr.validateToken(rawToken, EMAIL_TYPE.CONF, testPers1.email)
      ).resolves.toBeFalsy();
      await expect(
        uContr.confirmEmail(rawToken, testPers1.email)
      ).resolves.toBeFalsy();
    });
  });
});
