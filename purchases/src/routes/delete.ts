import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError,NotAuthorizedError} from '@secondchances/common';
import { Purchase, PurchaseStatus, } from '../models/purchase';
import { PurchaseCancelledPublisher } from '../events/publishers/purchase-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
//wiring up with router
const router = express.Router();
//deleteHandler
router.delete('/api/purchases/:purchaseId', requireAuth, async (req: Request, res: Response) => {
    const { purchaseId} = req.params; //pulling off purchaseId
    const purchase = await Purchase.findById(purchaseId).populate('item'); //again using populate to fetch more info
    if (!purchase) {
        throw new NotFoundError();
    }
    if (purchase.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
// same as with showing, we have either found it or not, if not tell us if user is authorized
// if yes, change the status, save it and send it
    purchase.status = PurchaseStatus.Cancelled;
    await purchase.save();
//emmiting an event saying it was cancelled
new PurchaseCancelledPublisher(natsWrapper.client).publish({
    id: purchase.id,
    //version: purchase.version,
    item: {
        id: purchase.item.id
    }
})
    res.status(204).send(purchase);
}
);

export { router as deletePurchaseRouter };