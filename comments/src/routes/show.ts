//showing comments of the user, needing auth
import express, { Request, Response } from 'express';
import {Comment} from '../models/comment';
import {NotFoundError} from '@secondchances/common';
//wiring up with router
const router = express.Router();
//getHandler
router.get('/api/comments/:commentId', async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params.commentId)//finding comment with certain commentId
    ; //using populate from monogoose to fetch other info about that comment
    
    if (!comment) {
        throw new NotFoundError(); //case in which route we try to connect into doesn't match any comments
    
    }
    res.send(comment);
}
);

export { router as showCommentRouter };