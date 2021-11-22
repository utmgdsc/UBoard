import express, { Request, Response } from 'express';
import db from '../../models';
import CommentController from '../../controllers/v1/comment';
import { getAuthUser } from '../../middleware/auth';

const commentRouter = express.Router();
const commentController = new CommentController(db.Post);

commentRouter.get('', async (req: Request, res: Response) => {
  const limit = req.body.limit;
  const offset = req.body.offset;
  if (!limit || offset == undefined) {
    return res.status(400).json({
      code: 400,
      message: `Missing ${!limit ? 'limit' : ''} ${
        !limit && !offset ? 'and' : ''
      } ${!offset ? 'offset' : ''}`,
    });
  }

  const result = await commentController.getPosts(limit, offset);
  return res.status(result.status).json(result);
});

commentRouter.get('/:postid', async (req: Request, res: Response) => {
  const result = await commentController.getPost(req.params.postid);
  res.status(result.status).json(result);
});

commentRouter.delete('/:postid', async (req: Request, res: Response) => {
  try {
    const result = await commentController.deletePost(
      getAuthUser(res).id,
      req.params.postid
    );
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

commentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const result = await commentController.createPost(
      getAuthUser(res).id,
      req.body.title,
      req.body.body,
      req.body.location,
      req.body.capacity
    );
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

commentRouter.put('/:postid', async (req: Request, res: Response) => {
  try {
    const result = await commentController.updatePost(
      getAuthUser(res).id,
      req.params.postid,
      req.body.title,
      req.body.body,
      req.body.location,
      req.body.capacity
    );

    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

export default commentRouter;
