import express, { Request, Response } from 'express';
import db from '../../models';
import CommentController from '../../controllers/v1/comment';
import { getAuthUser } from '../../middleware/auth';

const commentRouter = express.Router();
const commentController = new CommentController(db.Comment);

commentRouter.get('', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const postID = req.query.postid;
    if (!limit || offset == undefined || !postID) {
      return res.status(400).json({
        code: 400,
        message: `Missing ${!limit ? 'limit' : ''} ${
          !limit && !offset ? 'and' : ''
        } ${!offset ? 'offset' : ''}`,
      });
    }

    const result = await commentController.getComments(
      postID as string,
      Number(limit),
      Number(offset)
    );
    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

commentRouter.get('/:commentid', async (req: Request, res: Response) => {
  try {
    const result = await commentController.getComment(req.params.commentid);
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

commentRouter.delete('/:commentid', async (req: Request, res: Response) => {
  try {
    const result = await commentController.deleteComment(
      getAuthUser(res).id,
      req.params.commentid
    );
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

commentRouter.post('', async (req: Request, res: Response) => {
  try {
    const result = await commentController.createComment(
      req.body.body,
      getAuthUser(res).id,
      req.body.postid
    );
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

commentRouter.put('/:commentid', async (req: Request, res: Response) => {
  try {
    const result = await commentController.updateComment(
      getAuthUser(res).id,
      req.params.commentid,
      req.body.body
    );

    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
  }
});

export default commentRouter;
