import argon2 from "argon2";
import EmailService, { EMAIL_TYPE } from "../../services/emailService";
import { User } from "../../models/user";

export default class UserController {
  protected secret: string;
  protected UserModel: typeof User;
  protected emailService: EmailService;

  constructor(model: typeof User, secret: string, emailService: EmailService) {
    this.UserModel = model;
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

  /** Assign an emailing token to a user based on the provided type. If shouldEmail is true, the token is
  sent to the user in a URL format. Returns the success status. */
  async generateToken(
    user: User,
    type: EMAIL_TYPE,
    shouldEmail: boolean
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
    } catch {
      return false;
    }

    if (shouldEmail) {
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
    }

    return status;
  }

  /** Check whether the provided token matches the requested confirmation type (reset or account) 
  for the provided user email, and that it is not expired. Returns true on success, or false on failure. */
  async validateToken(
    token: string,
    type: EMAIL_TYPE,
    email: string
  ): Promise<boolean> {
    const dbTokenFormat = `${type}:${token}`;

    try {
      const target = await this.UserModel.findOne({ where: { email: email } });
      const currTime = new Date().getTime();
      if (
        !target ||
        target.confirmationToken !== dbTokenFormat ||
        target.confirmationTokenExpires.getTime() <= currTime
      )
        return false;
    } catch (err) {
      return false;
    }

    return true;
  }

  /** Confirm the user account associated with user if the provided token is valid and return true. 
    Returns false if the token or email is invalid.*/
  async confirmEmail(token: string, email: string): Promise<boolean> {
    if (!(await this.validateToken(token, EMAIL_TYPE.CONF, email))) {
      return false;
    }

    /* Confirm the User account and consume the token */
    try {
      await this.UserModel.update(
        {
          confirmed: true,
          confirmationToken: "",
        },
        { where: { email: email.toLowerCase() } }
      );
    } catch {
      return false;
    }
    return true;
  }

  /** Returns true and changes the password of the user associated to email with 
    newPass if the provided token is valid. Returns false if token, or email is invalid. */
  async resetPassword(
    token: string,
    email: string,
    newPass: string
  ): Promise<boolean> {
    if (!(await this.validateToken(token, EMAIL_TYPE.RESET, email))) {
      return false;
    }

    const hashed = await argon2.hash(newPass, {
      // should check newPass format before func call
      type: argon2.argon2id,
    });

    /* Change their password & Consume token */
    try {
      await this.UserModel.update(
        {
          password: hashed,
          confirmationToken: "",
        },
        { where: { email: email } }
      );
    } catch {
      return false;
    }

    return true;
  }
}
