import argon2 from 'argon2';
import db from '../../../models';
import {
  dbSync,
  makeUser,
  makeUserWithPass,
} from '../../../models/tests/testHelpers';
import { User } from '../../../models/user';
import UserController, { TOKEN_TYPE } from '../user';
import EmailService from '../../../services/emailService';

/* Setup mock email service */
const fakeSendConfirmEmail = jest.fn(() => true);
const fakeSendResetEmail = jest.fn(() => true);
jest.mock('../../../services/emailService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      sendConfirmEmail: fakeSendConfirmEmail,
      sendResetEmail: fakeSendResetEmail,
    };
  });
});
const baseRoute = `${process.env.PAGE_URL}`;

const userRepo: typeof User = db.User;
const EmailServiceMock = EmailService as jest.MockedClass<typeof EmailService>;
let testPerson: User;
let uContr: UserController;
let createdUser: User;
let signedInUser: User;
let createUserResponse: {
  status: number;
  data: any;
};
let signInResponse: {
  status: number;
  data: any;
};
let createUserDate: Date;
let signInDate: Date;

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));
  uContr = new UserController(db.User, new EmailServiceMock(baseRoute));
});

beforeEach(async () => {
  EmailServiceMock.mockClear();
  fakeSendConfirmEmail.mockClear();
  fakeSendResetEmail.mockClear();
});

describe('v1 - User Controller', () => {
  beforeAll(async () => {
    createUserDate = new Date();
    createUserResponse = await uContr.createUser(
      'email@mail.utoronto.ca',
      'userName',
      'password',
      'firstName',
      'lastName'
    );
    createdUser = (await userRepo.findOne({
      where: {
        userName: 'userName',
      },
    })) as User;
  });
  describe('createUser method', () => {
    describe('On success', () => {
      test('Status code 204 should be returned', () => {
        expect(createUserResponse.status).toBe(204);
      });

      test('User Model should contain user', () => {
        expect(createdUser).toBeDefined();
      });

      test('Email token should be generated', () => {
        expect(createdUser.confirmationToken).toContain(TOKEN_TYPE.CONF);
        expect(createdUser.confirmationTokenExpires.getTime()).toBeGreaterThan(
          createUserDate.getTime()
        );
      });
    });

    test('If user already exists, should return status 400', async () => {
      createUserResponse = await uContr.createUser(
        'email@mail.utoronto.ca',
        'userName',
        'password',
        'firstName',
        'lastName'
      );
      expect(createUserResponse.status).toBe(400);
    });
  });

  describe('signIn method', () => {
    test('If email has not been confirmed, should return status 403', async () => {
      signInResponse = await uContr.signIn('userName', 'password');
      expect(signInResponse.status).toBe(403);
    });

    test('If user does not exist, should return status 404', async () => {
      const invalidResponse = await uContr.signIn('whoDis', 'password');
      expect(invalidResponse.status).toBe(404);
    });

    test('If password is incorrect, should return status 400', async () => {
      const invalidResponse = await uContr.signIn('userName', 'wrongPassword');
      expect(invalidResponse.status).toBe(400);
    });

    describe('On success', () => {
      beforeAll(async () => {
        signedInUser = (await userRepo.findOne({
          where: {
            userName: 'userName',
          },
        })) as User;
        signedInUser.confirmed = true;
        signedInUser.save();
        signInDate = new Date();
        signInResponse = await uContr.signIn('userName', 'password');
      });

      test('Status code 204 should be returned', async () => {
        expect(signInResponse.status).toBe(204);
      });

      test('Last login date should be updated', async () => {
        signedInUser = (await userRepo.findOne({
          where: {
            userName: 'userName',
          },
        })) as User;
        expect(signedInUser.lastLogin.getTime()).toBeGreaterThan(
          signInDate.getTime()
        );
      });

      test('Password should not be included in serialized result', () => {
        expect(signInResponse.data.result.password).not.toBeDefined();
      });
    });
  });

  let rawToken: string;
  describe('Email Confirmations', () => {
    test('Generating CONF properly updates User entry', async () => {
      testPerson = await makeUser('constPers1', 'lol@utoronto.ca'); // initial test user

      if (!testPerson) {
        fail('nullperson'); // required to appease TS
      }
      expect(testPerson.confirmed).toBeFalsy();
      const status = await uContr.sendEmailConfirmation(testPerson.email);
      await testPerson.reload(); // refresh data from db
      rawToken = testPerson.confirmationToken;
      rawToken = rawToken.substring(rawToken.indexOf(':') + 1); // ignore the type part of "type:<token>"

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

    test('Ensure the conf token cannot be used for password reset', async () => {
      await expect(uContr.resetPassword(rawToken, '', '')).resolves.toBeFalsy();
    });

    test('Consume token and confirm the user account', async () => {
      const status: boolean = await uContr.confirmEmail(rawToken);
      expect(status).toBeTruthy();
      await testPerson.reload();
      expect(testPerson.confirmed).toBeTruthy();
      expect(testPerson.confirmationToken).toHaveLength(0);
      expect(testPerson.confirmationTokenExpires).toBeNull();
    });

    test('Ensure the token cannot be used again', async () => {
      await expect(uContr.confirmEmail(rawToken)).resolves.toBeFalsy();
    });
  });

  describe('Password Resets', () => {
    test('Generating password reset updates the user entry', async () => {
      testPerson = await makeUserWithPass('constPers2', 'lol2@utoronto.ca');
      expect(testPerson).toBeDefined();

      if (!testPerson) {
        fail('nullperson');
      }

      testPerson.confirmed = true;
      await testPerson.save();
      const status = await uContr.sendResetEmail(testPerson.email);
      await testPerson.reload();
      rawToken = testPerson.confirmationToken;
      rawToken = rawToken.substring(rawToken.indexOf(':') + 1); // ignore the type part of "type:<token>"

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

    test('Ensure the reset token cannot be used for confirmations', async () => {
      await expect(uContr.confirmEmail(rawToken)).resolves.toBeFalsy();
    });

    test('Ensure nothing happens if the new password is invalid', async () => {
      const pass = testPerson.password;
      const status: boolean = await uContr.resetPassword(rawToken, 'abc', 'vv');
      expect(status).toBeFalsy();
      await testPerson.reload();
      expect(testPerson.password).toEqual(pass);
      expect(testPerson.confirmationToken).not.toHaveLength(0);
      expect(testPerson.confirmationTokenExpires).not.toBeNull();
    });

    test('Ensure token is consumed and new password is set', async () => {
      const status: boolean = await uContr.resetPassword(
        rawToken,
        'newPassword',
        'newPassword'
      );
      expect(status).toBeTruthy();
      await testPerson.reload();
      const check = await argon2.verify(
        testPerson.password as string,
        'newPassword'
      );

      expect(check).toBeTruthy();
      expect(testPerson.confirmationToken).toHaveLength(0);
      expect(testPerson.confirmationTokenExpires).toBeNull();
    });
  });
});
