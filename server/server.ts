import express from 'express';
import cookieParser from 'cookie-parser';

import db from './models/index';
import v1Routes from './routes/v1';
import auth from './middleware/auth';
import fileUpload from './middleware/file-upload';

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

app.use(fileUpload);
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

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
