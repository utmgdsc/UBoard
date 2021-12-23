import express from 'express';
import userRouter from './user';
import postRouter from './post';
import commentsRouter from './comment';

const routes = express.Router();

routes.use('/users/', userRouter);
routes.use('/posts/', postRouter);
routes.use('/comments/', commentsRouter);

export default routes;
