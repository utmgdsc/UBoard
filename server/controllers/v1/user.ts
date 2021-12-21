import argon2 from 'argon2';

import { User, UserAttributes } from '../../models/user';
import EmailService from '../../services/emailService';

export enum TOKEN_TYPE {
  RESET = 'reset',
  CONF = 'conf',
}

export default class UserController {
  protected userRepo: typeof User;
  protected emailService: EmailService;

  constructor(model: typeof User, emailService: EmailService) {
    this.userRepo = model;
    this.emailService = emailService;
  }

  /**
   * Update the last login time of user to the current date.
   */
  private updateLastLogin = async (user: User): Promise<void> => {
    user.lastLogin = new Date();
    await user.save();
  };

  /**
   * Sign in the user with the given credentials if the user exists.
   * Generate auth token and update last login date.
   * @returns status code and data payload
   */
  async signIn(
    userName: string,
    password: string
  ): Promise<{
    status: number;
    data: { result?: UserAttributes; message?: string };
  }> {
    try {
      let userWithPass = await this.userRepo.scope('withPassword').findOne({
        where: {
          userName: userName,
        },
      });
      if (!userWithPass) {
        return { status: 404, data: { message: "User doesn't exist" } };
      }

      const isPasswordCorrect = await argon2.verify(
        userWithPass.password as string,
        password,
        {
          type: argon2.argon2id,
        }
      );
      if (!isPasswordCorrect) {
        return { status: 400, data: { message: 'Invalid credentials' } };
      }

      if (!userWithPass.confirmed) {
        return {
          status: 403,
          data: { message: 'Email has not been confirmed' },
        };
      }

      this.updateLastLogin(userWithPass);

      const user = Object.assign({}, userWithPass.get());

      delete user.password;

      return { status: 204, data: { result: user } };
    } catch (error) {
      console.error(error);
      return { status: 500, data: { message: 'Internal server error' } };
    }
  }

  /**
   * Create a new user if the user does not already exist.
   * Generate auth token, update last login date, and send confirmation email.
   * @returns status code and data payload
   */
  async createUser(
    email: string,
    userName: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ status: number; data: { message?: string } }> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          userName: userName,
        },
      });
      if (user) {
        return { status: 400, data: { message: 'User already exists' } };
      }

      const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
      });

      const result: User = await this.userRepo.create({
        email: email,
        userName: userName,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
      });

      await this.sendEmailConfirmation(result.email);

      return { status: 204, data: {} };
    } catch (error) {
      console.error(error);
      return { status: 500, data: { message: 'Internal server error' } };
    }
  }
  /* Email Related */

  /** Generates and returns a random alphanumeric string. Used in validating
    emails. */
  private generateRandom(): string {
    const alphabet =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var str = '';

    for (var i = 0; i < alphabet.length; i++) {
      str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return str;
  }

  /** Send a preformatted email to the user based on the email type. */
  protected async sendEmailHandler(
    user: User,
    type: TOKEN_TYPE,
    confToken: string
  ): Promise<boolean> {
    switch (type) {
      case TOKEN_TYPE.RESET: {
        return await this.emailService.sendResetEmail(
          confToken,
          user.firstName,
          user.lastName,
          user.userName,
          user.email
        );
      }
      case TOKEN_TYPE.CONF: {
        return await this.emailService.sendConfirmEmail(
          confToken,
          user.firstName,
          user.lastName,
          user.email
        );
      }
    }
  }

  /** Assign an emailing token to a user based on the provided type and send them an email.
    Returns the success status. */
  protected async generateToken(
    user: User,
    type: TOKEN_TYPE
  ): Promise<boolean> {
    const confToken = this.generateRandom();

    var dateExpires: Date = new Date();
    dateExpires.setUTCHours(dateExpires.getUTCHours() + 12); // expires 12hrs from now

    /* Assign token to user (invalidate previous ones)*/
    try {
      await user.update({
        confirmationToken: `${type}:${confToken}`, // store the type so we can validate it later
        confirmationTokenExpires: dateExpires,
      });
    } catch (err) {
      console.error(`generateToken failed: ${err}`);
      return false;
    }

    return await this.sendEmailHandler(user, type, confToken);
  }

  /** Check whether the provided token matches the requested confirmation type (reset or account) 
    and that it is not expired. Returns the user it matches on success, or null on failure. */
  protected async validateToken(
    token: string,
    type: TOKEN_TYPE
  ): Promise<User | null> {
    const dbTokenFormat = `${type}:${token}`;
    var user: User | null = null;

    try {
      user = await this.userRepo.findOne({
        where: { confirmationToken: dbTokenFormat },
      });
      const currTime = new Date().getTime();
      if (
        !user ||
        user.confirmationToken !== dbTokenFormat ||
        user.confirmationTokenExpires.getTime() <= currTime
      ) {
        return null;
      }
    } catch (err) {
      console.error(`validateToken failed: ${err}`);
      return null;
    }

    return user;
  }

  /** Generate and send the user an email to reset their password.
      Returns the success status. */
  async sendResetEmail(
    emailAddress: string
  ): Promise<{ status: number; data?: { message: string } }> {
    const user: User | null = await this.userRepo.findOne({
      where: { email: emailAddress.toLowerCase(), confirmed: true },
    });
    if (!user) {
      return { status: 400, data: { message: 'Invalid email address.' } };
    }
    if (!(await this.generateToken(user, TOKEN_TYPE.RESET))) {
      return {
        status: 500,
        data: { message: 'Failed to generate password reset email.' },
      };
    }

    return { status: 204 };
  }

  /** Generate and send the user an email to confirm their account.
      Returns the success status. */
  async sendEmailConfirmation(emailAddress: string): Promise<boolean> {
    const user: User | null = await this.userRepo.findOne({
      where: { email: emailAddress.toLowerCase() },
    });
    if (!user) {
      return false;
    }
    return await this.generateToken(user, TOKEN_TYPE.CONF);
  }

  /** Confirm the user account associated with the token if it is valid. 
    Returns false if the token is invalid or expired.*/
  async confirmEmail(token: string): Promise<boolean> {
    const user: User | null = await this.validateToken(token, TOKEN_TYPE.CONF);
    if (!user) {
      return false;
    }

    /* Confirm the User account and consume the token */
    try {
      await user.update({
        confirmed: true,
        confirmationToken: '',
        confirmationTokenExpires: null,
      });
    } catch (err) {
      console.error(`confirmEmail failed: ${err}`);
      return false;
    }

    return true;
  }

  /** Returns true and changes the password of the user associated to the token, given that the token is valid.
   If the token is expired, or invalid, return false. */
  async resetPassword(
    token: string,
    newPass: string,
    newPassConf: string
  ): Promise<boolean> {
    const user: User | null = await this.validateToken(token, TOKEN_TYPE.RESET);

    if (!user || newPass !== newPassConf) {
      return false;
    }

    const hashed = await argon2.hash(newPass, {
      // should check newPass format before func call
      type: argon2.argon2id,
    });

    /* Change their password & Consume token */
    try {
      await user.update({
        password: hashed,
        confirmationToken: '',
        confirmationTokenExpires: null,
      });
    } catch (err) {
      console.error(`resetPassword (update) failed: ${err}`);
      return false;
    }

    return true;
  }
}
