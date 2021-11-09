import express from 'express';
import userRouter from './user';
import postRouter from './post';

const routes = express.Router();

routes.use('/users/', userRouter);
routes.use('/posts/', postRouter);

export default routes;
