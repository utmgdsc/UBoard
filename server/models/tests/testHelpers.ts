import db from '../index';
import { Post } from '../post';
import { User } from '../user';
import { Comment } from '../comment';

const UserModel: typeof User = db.User;
const PostModel: typeof Post = db.Post;
const CommentModel: typeof Comment = db.Comment;

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
  const testPost: Post = await PostModel.create({
    title: title,
    body: body,
    feedbackScore: 10,
    capacity: 10,
    location: 'toronto',
    thumbnail: 'some-path',
    UserId: authorid,
  }).catch((err: Error) => {
    throw err;
  });
  return testPost;
}

export async function makeValidPost(authorID: string): Promise<Post> {
  return makePost(
    authorID,
    'This is a new post!',
    'This is a new post!This is a new post!'
  );
}

/*
Create a (basic) Comment entry in our database with the provided userid of the
provided post, with  body. Return the comment on success, or throw an error on failure. 
*/
export async function makeComment(
  body: string,
  UserID: string,
  PostID: string
): Promise<Comment> {
  const testComment: Comment = await CommentModel.create({
    body: body,
    UserId: UserID,
    PostId: PostID,
  }).catch((err: Error) => {
    throw err;
  });
  return testComment;
}

/* 
Create a Comment entry in our databse with the given author id and post 
id. Return the entry that was created.
*/
export async function makeValidComment(
  authorID: string,
  postID: string
): Promise<Comment> {
  return makeComment('This is the body of the comment', authorID, postID);
}

/* Ensure that the database is synchronized properly. The sync is forced, so any existing tables
are dropped and re-made. */
export async function dbSync() {
  await db.sequelize.sync({ force: true });
}
