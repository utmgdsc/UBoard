import { dbSync, makeUser } from "../../../models/tests/testHelpers";
import { User } from "../../../models/user";
import db from "../../../models/index";
import {
  confirmEmail,
  CONF_TYPE,
  generateEmailToken,
  validateToken,
} from "../emailService";

let testPers1: User;

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));
  testPers1 = await makeUser("constPers1", "lol@utoronto.ca");
  expect(testPers1).toBeDefined();
});

describe("Basic tests on all token functions", () => {
  describe("Authorized token usage", () => {
    test("Generating a token properly updates User entry", async () => {
      /* Query to see if anything was inserted */

      if (!testPers1) fail(); // required to appease TS

      console.log(testPers1);

      expect(testPers1.confirmed).toBeFalsy();
      const status = await generateEmailToken(testPers1, CONF_TYPE, false);
      expect(status).toBeTruthy();
      expect(testPers1.confirmationToken).toContain(CONF_TYPE);

      const curr = new Date().getTime();
      expect(testPers1.confirmationTokenExpires.getTime()).toBeGreaterThan(
        curr
      ); // token should not be expired since it is fresh
    }); /* End Test 1 */

    test("Use validateToken function on what we just generated", async () => {
      await expect(
        validateToken(
          testPers1.confirmationToken.substring(2),
          /* The db token entry is different from how a token shown to the user is formatted. In the db,
           we have an extra type indicator infront of the token. We want to skip this indicator when passing to the function */
          CONF_TYPE,
          testPers1.email
        )
      ).resolves.toBeTruthy();
    });

    test("Use confirmEmail to validate our user. Ensure token is consumed", async () => {
      const status: boolean = await confirmEmail(
        testPers1.confirmationToken.substring(2),
        testPers1.email
      );
      testPers1 = await db.User.findOne({ where: { email: testPers1.email } });

      expect(status).toBeTruthy();
      expect(testPers1.confirmed).toBeTruthy();
      expect(testPers1.confirmationToken).toHaveLength(0);
    });

    test("Attempt to use an invalid token", async () => {
      expect(
        validateToken(
          testPers1.confirmationToken.substring(2),
          CONF_TYPE,
          testPers1.email
        )
      ).resolves.toBeFalsy();
    });
  });
});
