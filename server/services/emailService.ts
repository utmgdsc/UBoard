import sgMail from "@sendgrid/mail";

export enum EMAIL_TYPE {
  RESET = "reset",
  CONF = "conf",
}

export default class EmailService {
  private _sender: string;

  constructor(sender: string = "uboard-noreply@plausible.ca") {
    this._sender = sender;
    sgMail.setApiKey(<string>process.env.SENDGRID_API);
  }

  /** Sends an email using the SendGrid API with the provided parameters. Returns the success status. */
  private async sendEmail(
    emailAddress: string,
    subjectLine: string,
    body: string,
    html: string
  ) {
    var status: boolean = true;

    const msg = {
      to: emailAddress,
      from: this._sender,
      subject: subjectLine,
      text: body,
      html: html,
    };
    sgMail.send(msg).catch((error: any) => {
      status = false;
    });

    return status;
  }

  /** Sends an account confirmation email based on the provided parameters. Returns the success status. */
  async sendConfirmEmail(
    confToken: string,
    firstName: string,
    lastName: string,
    emailAddress: string
  ): Promise<boolean> {
    const emailURL = `${process.env.WEBSITE}/c=${confToken}`; // this will be our route
    const subjectLine = "UBoard - Confirm your Email Address";

    const body = `Thank you for signing up to UBoard, ${firstName} ${lastName}.
    
    To continue with your account registration, please confirm your email address by visiting: 
    
    ${emailURL}`;
    const html = `Thank you for signing up to UBoard, ${firstName} ${lastName}. </br>
        
    To continue with your account registration, please confirm your email address by <a href="${emailURL}">clicking here</a>
        `;

    return await this.sendEmail(emailAddress, subjectLine, body, html);
  }

  /** Sends a password reset email to the user based on the provided parameters. Returns the success status. */
  async sendResetEmail(
    confToken: string,
    firstName: string,
    lastName: string,
    userName: string,
    emailAddress: string
  ): Promise<boolean> {
    const emailURL = `${process.env.WEBSITE}/r=${confToken}`;
    const subjectLine = "UBoard - Password Reset Requested";
    const body = `Hello,  ${firstName} ${lastName}.
        A password reset has been requested for the account with username: ${userName}. To reset your password, click the link below. 
        ${emailURL}
        `;
    const html = `Hello, ${firstName} ${lastName}.  </br>
        A password reset has been requested for the account with username: ${userName}. To reset your password, <a href="${emailURL}">click here</a>
        `;

    return await this.sendEmail(emailAddress, subjectLine, body, html);
  }
}
