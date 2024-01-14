import express, { Request, Response } from 'express';
import { requireAuth} from '@secondchances/common';
import { Comment } from '../models/comment';
//wiring up with router
const router = express.Router();
//getHandler

router.get('/api/comments/:userId',requireAuth, async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const comments = await Comment.find({ userId });
    res.send(comments);
});


export { router as userIndexCommentRouter };