import argon2 from "argon2";
import EmailService, { EMAIL_TYPE } from "../../services/emailService";
import { User } from "../../models/user";

export default class UserController {
  protected secret: string;
  protected userRepo: typeof User;
  protected emailService: EmailService;

  constructor(model: typeof User, secret: string, emailService: EmailService) {
    this.userRepo = model;
    this.secret = secret;
    this.emailService = emailService;
  }

  /* Email Related */

  /** Generates and returns a random alphanumeric string. Used in validating
    emails. */
  private generateRandom(): string {
    const alphabet =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var str = "";

    for (var i = 0; i < alphabet.length; i++) {
      str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return str;
  }

  /** Send a preformatted email to the user based on the email type. */
  protected async sendEmailHandler(
    user: User,
    type: EMAIL_TYPE,
    confToken: string
  ) {
    var status: boolean = true;
    switch (type) {
      case EMAIL_TYPE.RESET: {
        status = await this.emailService.sendResetEmail(
          confToken,
          user.firstName,
          user.lastName,
          user.userName,
          user.email
        );
        break;
      }
      case EMAIL_TYPE.CONF: {
        status = await this.emailService.sendConfirmEmail(
          confToken,
          user.firstName,
          user.lastName,
          user.email
        );
        break;
      }
      default: {
        // should never reach here
        return false;
      }
    }

    return status;
  }

  /** Assign an emailing token to a user based on the provided type and send them an email.
    Returns the success status. */
  protected async generateToken(
    user: User,
    type: EMAIL_TYPE
  ): Promise<boolean> {
    const confToken = this.generateRandom();
    var status: boolean = true;

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

    status = await this.sendEmailHandler(user, type, confToken);

    return status;
  }

  /** Check whether the provided token matches the requested confirmation type (reset or account) 
  for the provided user email, and that it is not expired. Returns true on success, or false on failure. */
  protected async validateToken(
    token: string,
    type: EMAIL_TYPE,
    email: string
  ): Promise<boolean> {
    const dbTokenFormat = `${type}:${token}`;

    try {
      const user = await this.userRepo.findOne({ where: { email: email } });
      const currTime = new Date().getTime();
      if (
        !user ||
        user.confirmationToken !== dbTokenFormat ||
        user.confirmationTokenExpires.getTime() <= currTime
      )
        return false;
    } catch (err) {
      console.error(`validateToken failed: ${err}`);
      return false;
    }

    return true;
  }

  /** Generate and send the user an email to reset their password.
      Returns the success status. */
  async sendResetEmail(user: User) {
    const status = await this.generateToken(user, EMAIL_TYPE.RESET);
    return status;
  }

  /** Generate and send the user an email to confirm their account.
      Returns the success status. */
  async sendEmailConfirmation(user: User) {
    const status = await this.generateToken(user, EMAIL_TYPE.CONF);
    return status;
  }

  /** Confirm the user account associated with user if the provided token is valid and return true. 
    Returns false if the token or email is invalid.*/
  async confirmEmail(token: string, email: string): Promise<boolean> {
    if (!(await this.validateToken(token, EMAIL_TYPE.CONF, email))) {
      return false;
    }

    /* Confirm the User account and consume the token */
    try {
      await this.userRepo.update(
        {
          confirmed: true,
          confirmationToken: "",
          confirmationTokenExpires: undefined,
        },
        { where: { email: email.toLowerCase() } }
      );
    } catch (err) {
      console.error(`confirmEmail failed: ${err}`);
      return false;
    }
    return true;
  }

  /** Returns true and changes the password of the user associated to email with 
    newPass if the provided token is valid. Returns false if token, or email is invalid. */
  async resetPassword(
    token: string,
    email: string,
    newPass: string,
    newPassConf: string
  ): Promise<boolean> {
    if (
      !(await this.validateToken(token, EMAIL_TYPE.RESET, email)) ||
      newPass !== newPassConf
    ) {
      return false;
    }

    const hashed = await argon2.hash(newPass, {
      // should check newPass format before func call
      type: argon2.argon2id,
    });

    /* Change their password & Consume token */
    try {
      await this.userRepo.update(
        {
          password: hashed,
          confirmationToken: "",
          confirmationTokenExpires: undefined,
        },
        { where: { email: email } }
      );
    } catch (err) {
      console.error(`resetPassword (update) failed: ${err}`);
      return false;
    }

    return true;
  }
}
