import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@secondchances/common';
import { body } from 'express-validator';
import { Item } from '../models/item';
import { Purchase } from '../models/purchase';
import { NotFoundError} from '@secondchances/common';
import {PurchaseStatus} from '@secondchances/common'
import {BadRequestError} from '@secondchances/common';
import { PurchaseCreatedPublisher } from '../events/publishers/purchase-created-publisher';
import { natsWrapper } from '../nats-wrapper';
//wiring up with router
const router = express.Router();
//postHandler with authenthication
router.post('/api/purchases', requireAuth, [
    body('itemId')
        .not()
        .isEmpty()
        .withMessage('Prosze podac ID przedmiotu')
], validateRequest, async (req: Request, res: Response) => {
    //sprawdzenie czy przedmiot istnieje
const {itemId} = req.body;
const item = await Item.findById(itemId);
if (!item){
    throw new NotFoundError();
}//sprawdzenie czy przedmiot jest zarezerwowany
const isReserved = await item.isReserved(); 
if (isReserved) {
    throw new BadRequestError('Reserved item!');
}
    //zdefiniowanie czasu wygasniecia
const expiration = new Date();
expiration.setSeconds(expiration.getSeconds()+1*60);
    //tworzenie zamowienia
const purchase = Purchase.build({
    userId: req.currentUser!.id,
    status: PurchaseStatus.Created,
    expiresAt: expiration,
    item: item,
});
await purchase.save();
//emiting purchase created event (so we need to show purchase and the item it belongs to)
new PurchaseCreatedPublisher(natsWrapper.client).publish({
    id: purchase.id,
    //version: purchase.version,
    status: purchase.status,
    userId: purchase.userId,
    expiresAt: purchase.expiresAt.toISOString(), //its done because jsonfied info has to be in string AND we want agnostic answer not based on server's timezone
    item: {
        id: item.id,
        price: item.price,
        userId: item.userId,
    }
});
    await Item.findOneAndUpdate({id:item.id},{purchaseId:purchase.id})
    //creating an event saying that purhcase order was created
    res.status(201).send(purchase);

}
);

export { router as addPurchaseRouter };