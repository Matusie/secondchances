import express, { Request, Response } from 'express';
import { requireAuth} from '@secondchances/common';
import { Purchase } from '../models/purchase';
//wiring up with router
const router = express.Router();
//getHandler
router.get('/api/purchases', async (req: Request, res: Response) => {
    const purchases = await Purchase.find({ //finding all the users with certain ID, so who made a request
         userId: req.currentUser!.id// we want to be the only people with access to our orders

    }).populate('item'); //using mongooose populate system we fetch also info about the item of the purchase
    res.send(purchases);
}
);

export { router as indexPurchaseRouter };