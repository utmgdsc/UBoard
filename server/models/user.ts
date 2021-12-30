import { Sequelize, Model, UUIDV4, DataTypes, Optional } from 'sequelize';

// How many failed login attempts before we lock the user out.
export const MAX_LOGIN_ATTEMPTS = 5;

// How long to lock the user out after failed login attempts.
export const LOGIN_TIMEOUT = 15;

export interface UserAttributes {
  /* Login Specific */
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password?: string; // hash
  email: string;
  confirmed: boolean;
  confirmationToken: string;
  confirmationTokenExpires: Date | null;

  /* Logs */
  lastLogin: Date;
  canLoginAfter: Date | null;
  failedLoginAttempts: Number;
  karma: Number;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'confirmed'
    | 'confirmationToken'
    | 'confirmationTokenExpires'
    | 'lastLogin'
    | 'canLoginAfter'
    | 'failedLoginAttempts'
    | 'karma'
  > {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: string; // uuidv4
  firstName!: string;
  lastName!: string;
  userName!: string;
  password?: string;
  email!: string;
  confirmed!: boolean;
  confirmationToken!: string;
  confirmationTokenExpires!: Date;

  lastLogin!: Date;
  canLoginAfter!: Date | null;
  failedLoginAttempts!: Number;
  karma!: Number; // Should not be revealed to public

  hasTooManyLogins() {
    return (
      this.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS &&
      this.canLoginAfter &&
      this.canLoginAfter > new Date()
    );
  }

  async updateFailedLogin() {
    if (this.canLoginAfter && this.canLoginAfter < new Date()) {
      this.failedLoginAttempts = 0;
    }

    this.canLoginAfter = new Date(Date.now() + LOGIN_TIMEOUT * 60 * 1000);
    this.failedLoginAttempts = this.failedLoginAttempts.valueOf() + 1;
    await this.save();
  }

  static associate(model: any) {
    User.hasMany(model.Post, {
      foreignKey: { name: 'UserId', allowNull: false },
    });
    User.hasMany(model.Comment, { foreignKey: { allowNull: false } });
    /* Userid is stored inside of respective Post, and Comment */
  }
}

module.exports = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      userName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true /* Check for valid email format */,
          is: ['.*@(mail.|alum.|)utoronto.ca'] /* Check for utoronto domain */,
        },
      },
      confirmed: {
        /* Email Confirmed */ type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
      },
      karma: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      confirmationToken: {
        type: DataTypes.STRING,
      },
      confirmationTokenExpires: {
        type: DataTypes.DATE,
      },
      canLoginAfter: {
        type: DataTypes.DATE,
      },
      failedLoginAttempts: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          unique: true,
          name: 'unique_username', // validate case sensitive username
          fields: [Sequelize.fn('lower', Sequelize.col('userName'))],
        },
      ],
      hooks: {
        beforeValidate: (user, options) => {
          if (user.email) {
            user.email = user.email.toLowerCase();
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: { exclude: [] },
        },
      },
      modelName: 'User',
      sequelize,
    }
  );

  return User;
};
