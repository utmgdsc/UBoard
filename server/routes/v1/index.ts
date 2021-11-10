import express from 'express';
import userRouter from './user';
import postRouter from './post';
import auth from '../../middleware/auth';
import db from '../../models';

const routes = express.Router();

routes.use('/users/', userRouter);
routes.use('/posts/', auth(db.User), postRouter);

export default routes;
