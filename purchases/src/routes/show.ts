//showing purchases of the user, needing auth
import express, { Request, Response } from 'express';
import {Purchase} from '../models/purchase';
import {requireAuth, NotFoundError, NotAuthorizedError} from '@secondchances/common';
//wiring up with router
const router = express.Router();
//getHandler
router.get('/api/purchases/:purchaseId', requireAuth, async (req: Request, res: Response) => {
    const purchase = await Purchase.findById(req.params.purchaseId)//finding purchase with certain purchaseId
    .populate('item'); //using populate from monogoose to fetch other info about that purchase
    
    if (!purchase) {
        throw new NotFoundError(); //case in which route we try to connect into doesn't match any purchases
    }
    if (purchase.userId !== req.currentUser!.id){
        throw new NotAuthorizedError(); //case in which purchase exist, but userId does not match
    }
    res.send(purchase);
}
);

export { router as showPurchaseRouter };