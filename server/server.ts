import express from 'express';
import cookieParser from 'cookie-parser';

import db from './models/index';
import v1Routes from './routes/v1';
import auth from './middleware/auth';

if (!process.env.JWT_SECRET) {
  const err = 'Missing jwt secret';
  console.error(err);
  throw new Error(err);
}

if (!process.env.PAGE_URL) {
  const err = 'Missing page url';
  console.error(err);
  throw new Error(err);
}

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// The list of paths which should skip authentication.
const noAuthPaths = [
  '/signin',
  '/signup',
  '/signout',
  '/request-password-reset',
  '/confirm-email',
  '/reset-password',
];
app.use(
  auth(
    db.User,
    noAuthPaths.map(
      (path) => `/api/v[0-9]{1,}/users/${path.replace(/^\//, '')}`
    )
  )
);

app.use('/api/v1', v1Routes);

import { makePost, makeUser } from './models/tests/testHelpers';
import UserController from './controllers/v1/user';
import EmailService from './services/emailService';

const Ucontr = new UserController(
  db.User,
  new EmailService(process.env.SENDGRID_API as string)
);

db.sequelize.sync().then(() => {
  app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
    
    const uid = await makeUser('testingll', 'test@utoronto.ca');
    const str = 'a';

    await makePost(
      uid.id,
      `${str.repeat(300)}`,
      `${str.repeat(800)}`
      // 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'
    );

    await Ucontr.createUser(
      'v@mail.utoronto.ca',
      'username',
      'password123',
      'John',
      'Locke'
    );

    await db.User.update(
      {
        confirmed: true,
      },
      {
        where: {
          email: 'v@mail.utoronto.ca',
        },
      }
    );
  });
});