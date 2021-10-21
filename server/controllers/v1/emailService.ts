import { User } from "../../models/user";
import db from "../../models/index";
import sgMail from "@sendgrid/mail";
import argon2 from "argon2";
require("dotenv").config();
sgMail.setApiKey(<string>process.env.SENDGRID_API);

export const CONF_TYPE = "c"; /* Account email confirmation */
export const RESET_TYPE = "r"; /* Password Reset */
const userModel: typeof User = db.User;

/* Generates and returns a random alphanumeric string. Used in validating
    emails. */
function generateRandom(): string {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var str = "";

  for (var i = 0; i < alphabet.length; i++) {
    str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return str;
}

/* Assign a specific confirmation token the provided user based on the provided type (confirmation or password reset).
If shouldEmail is true, an email is sent to the User. Returns true on success, or false on failure.*/
export async function generateEmailToken(
  user: User,
  type: string,
  shouldEmail: boolean
): Promise<boolean> {
  const confToken = generateRandom();
  var status: boolean = true;

  var dateExpires: Date = new Date();
  dateExpires.setUTCHours(dateExpires.getUTCHours() + 12); // expires 12hrs from now

  /* Assign token to user (invalidate previous ones)*/
  try {
    await user.update({
      confirmationToken: `${type}:${confToken}`,
      confirmationTokenExpires: dateExpires,
    });
  } catch (err) {
    throw err;
  }

  if (shouldEmail) status = await sendEmail(type, confToken, user);

  return status;
}

/* Send an email containing the confToken in a URL to the provided user. Return true on success,
or false on failure. */
export async function sendEmail(
  type: string,
  confToken: string,
  user: User
): Promise<boolean> {
  var emailURL: string;
  var subjectLine: string;
  var body: string;
  var html: string;

  if (type === CONF_TYPE) {
    emailURL = `${process.env.WEBSITE}/c=${confToken}&e=${user.email}`; // this will be our route
    subjectLine = "UBoard - Confirm your Email Address";

    body = `Thank you for signing up to UBoard, ${user.firstName} ${user.lastName}. \n
    
    To continue with your account registration, please confirm your email address by visiting: 
    
    ${emailURL}`;
    html = `Thank you for signing up to UBoard, ${user.firstName} ${user.lastName}.\n
        
    To continue with your account registration, please confirm your email address by <a href="${emailURL}">clicking here</a>
        `;
  } else {
    emailURL = `${process.env.WEBSITE}/r=${confToken}&e=${user.email}`;
    subjectLine = "UBoard - Password Reset Requested";
    body = `Hello,  ${user.firstName} ${user.lastName}.

        A password reset has been requested for the account with username: ${user.userName}. To reset your password, click the link below. 
        ${emailURL}
        `;
    html = `Hello, ${user.firstName} ${user.lastName}. 
        A password reset has been requested for the account with username: ${user.userName}. To reset your password, <a href="${emailURL}">click here</a>
        `;
  }

  const msg = {
    to: user.email,
    from: <string>process.env.FROM_EMAIL,
    subject: subjectLine,
    text: body,
    html: html,
  };
  sgMail.send(msg).catch((error: any) => {
    return false;
  });

  return true;
}

/* Check whether the provided token matches the requested confirmation type (reset or account) 
  for the provided user email, and that it is not expired. Returns true on success, or false on failure. */
export async function validateToken(
  token: string,
  type: string,
  email: string
): Promise<boolean> {
  const dbTokenFormat = `${type}:${token}`; // we stored 'type' infront of the actual token, used to validate the type

  try {
    const target = await userModel.findOne({ where: { email: email } });
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

/* Confirm the account associated with the 'token' confirmation. Return true on success, or false 
if the token was invalid or another error occurred. */
export async function confirmEmail(
  token: string,
  email: string
): Promise<boolean> {
  if (!(await validateToken(token, CONF_TYPE, email))) return false;

  /* Confirm the User account and consume the token */
  try {
    await userModel.update(
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

/* Check the validity of the token, and proceed to reset the password of the user associated
to the email with newPass. Returns true on success, or false on failure. */
export async function resetPassword(
  token: string,
  email: string,
  newPass: string
): Promise<boolean> {
  if (!(await validateToken(token, RESET_TYPE, email))) return false;

  const hashed = await argon2.hash(newPass, {
    type: argon2.argon2id,
  });

  /* Change their password & Consume token */
  try {
    await userModel.update(
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
