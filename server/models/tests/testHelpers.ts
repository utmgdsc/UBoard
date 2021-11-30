import db from '../index';
import { Post } from '../post';
import { User } from '../user';

const UserModel: typeof User = db.User;
const PostModel: typeof Post = db.Post;

/* 
Create a User entry in our database with the given user and email string. Returns
the entry that was created on success, or throws an error on failure.
*/
export async function makeUser(user: string, email: string): Promise<User> {
  const testUser: User = await UserModel.create({
    firstName: 'test',
    lastName: 'test',
    userName: user,
    password: 'pass',
    email: email,
  }).catch((err: Error) => {
    throw err;
  });

  return testUser;
}

/* 
Create a User entry in our database with the given user and email string
with the password as part of the serialized object. Returns
the entry that was created on success, or throws an error on failure.
*/
export async function makeUserWithPass(
  user: string,
  email: string
): Promise<User> {
  const testUser: User = await UserModel.scope('withPassword')
    .create({
      firstName: 'test',
      lastName: 'test',
      userName: user,
      password: 'pass',
      email: email,
    })
    .catch((err: Error) => {
      throw err;
    });

  return testUser;
}

/**
 * @returns A valid user record.
 */
export async function makeValidUser(): Promise<User> {
  return makeUser('validUser', 'valid@mail.utoronto.ca');
}

/* Create a (basic) Post entry in our database with the provided userid of the author, 
title, and body. Return the post on success, or throw an error on failure. 
*/
export async function makePost(
  authorid: string,
  title: string,
  body: string
): Promise<Post> {
  return await PostModel.create({
    title: title,
    body: body,
    feedbackScore: 10,
    capacity: 10,
    location: 'toronto',
    thumbnail: 'some-path',
    UserId: authorid,
  });
}

export async function makeValidPost(authorID: string): Promise<Post> {
  return makePost(
    authorID,
    'This is a new post!',
    'This is a new post!This is a new post!'
  );
}

/* Ensure that the database is synchronized properly. The sync is forced, so any existing tables
are dropped and re-made. */
export async function dbSync() {
  await db.sequelize.sync({ force: true });
}
