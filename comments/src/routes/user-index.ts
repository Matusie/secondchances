import express, { Request, Response } from 'express';
import { requireAuth} from '@secondchances/common';
import { Comment } from '../models/comment';
//wiring up with router
const router = express.Router();
//getHandler
router.get('/api/myComments',requireAuth, async (req: Request, res: Response) => {
    if(!req.currentUser){
       return res.send("not logged in")
    }
    const comments = await Comment.find({ //finding all the users with certain ID, so who made a request
         userId: req.currentUser!.id// we want to be the only people with access to our orders

    }); //using mongooose populate system we fetch also info about the item of the purchase
    res.send(comments);
}
);

export { router as indexUserCommentRouter };