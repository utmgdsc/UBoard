import express, { Request, Response } from 'express';
import db from '../../models';
import PostController from '../../controllers/v1/post';
import { getAuthUser } from '../../middleware/auth';
import FileManager from '../../services/fileManager';

const fileManager = new FileManager();

const postRouter = express.Router();
const postController = new PostController(
  db.Post,
  db.UserPostLikes,
  db.Tag,
  fileManager
);

postRouter.get('', async (req: Request, res: Response) => {
  const limit = req.query.limit;
  const offset = req.query.offset;

  if (!limit || offset == undefined) {
    return res.status(400).json({
      code: 400,
      message: `Missing ${!limit ? 'limit' : ''} ${
        !limit && !offset ? 'and' : ''
      } ${!offset ? 'offset' : ''}`,
    });
  }
  try {
    const result = await postController.getPosts(
      getAuthUser(res).id,
      Number(limit),
      Number(offset)
    );
    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

postRouter.get('/:postid', async (req: Request, res: Response) => {
  try {
    const result = await postController.getPost(
      getAuthUser(res).id,
      req.params.postid
    );
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

postRouter.delete('/:postid', async (req: Request, res: Response) => {
  try {
    const result = await postController.deletePost(
      getAuthUser(res).id,
      req.params.postid
    );
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

postRouter.put('/:postid/upvote', async (req: Request, res: Response) => {
  try {
    const result = await postController.upVote(
      getAuthUser(res).id,
      req.params.postid
    );
    res.status(result.status);
  } catch (err) {
    console.error(err);
  }
});

postRouter.put('/:postid/downvote', async (req: Request, res: Response) => {
  try {
    const result = await postController.downVote(
      getAuthUser(res).id,
      req.params.postid
    );
    res.status(result.status);
  } catch (err) {
    console.error(err);
  }
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
      req.body.capacity,
      req.body.tags,
      req.body.coords,
      req.file
    );
    res.status(result.status).json(result);
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
      req.body.capacity,
      req.body.coords
    );

    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

export default postRouter;
