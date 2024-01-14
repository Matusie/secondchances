import express, { Request, Response } from 'express';
import { requireAuth} from '@secondchances/common';
import { Comment } from '../models/comment';
//wiring up with router
const router = express.Router();
//getHandler
router.get('/api/comments', async (req: Request, res: Response) => {
   
    const comments = await Comment.find() //using mongooose populate system we fetch also info about the item of the purchase
    res.send(comments);
}
);

export { router as indexCommentRouter };