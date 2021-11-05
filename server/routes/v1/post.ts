import express, {Request, Response} from 'express';
import db from '../../models';
import PostController from '../../controllers/v1/post';
import {User} from '../../models/user';
import {getAuthUser} from '../../middleware/auth';

const postRouter = express.Router();
const postController = new PostController(db.User);

postRouter.get('', async (req: Request, res: Response) => {
  const limit = req.body.limit;
  const offset = req.body.offset;
  if (!limit || !offset) {
    return res.status(400).send({code: 400, message: 'Missing limit or offset'});
  }

  const result = await postController.getPosts(limit, offset);
  return res.status(result.status).send(result);
});

postRouter.get('/:postid', async (req: Request, res: Response) => {
  const result = await postController.getPost(req.params.postid);
  res.status(result.status).send(result);
});

postRouter.delete('/:postid', async (req: Request, res: Response) => {
  try {
    const result = await postController.deletePost(getAuthUser(res).id, req.params.postid);
    res.status(result.status).send(result);
  } catch (err) {
    console.error(err);
  }
});

postRouter.put('/:postid/upvote', async (req: Request, res: Response) => {
  const result = await postController.upVote(req.params.postid);
  res.status(result.status);
});

postRouter.put('/:postid/report', async (req: Request, res: Response) => {
  const result = await postController.report(req.params.postid);
  res.status(result.status);
});

postRouter.post('/', async (req: Request, res: Response) => {
  try {
    const result = await postController.createPost(
      getAuthUser(res).id,
      req.body.title,
      req.body.body,
      req.body.location,
      req.body.capacity
    );
    res.status(result.status).send(result);
  } catch (err) {
    console.error(err);
  }
});

postRouter.put('/:postid', async (req: Request, res: Response) => {
  try {
    const result = await postController.updatePost(
      getAuthUser(res).id,
      req.params.postid,
      req.body.title,
      req.body.body,
      req.body.location,
      req.body.capacity
    );

    res.status(result.status).send(result);
  } catch (err) {
    console.error(err);
  }
});

export default postRouter;
