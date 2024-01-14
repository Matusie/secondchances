import express from 'express';
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError, BadRequestError, validateRequest, requireAuth, NotAuthorizedError, PurchaseStatus } from '@secondchances/common';
import { Purchase } from '../models/purchase';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();
router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty()
        .withMessage('You must have token'),
    body('purchaseId')
        .not()
        .isEmpty()
        .withMessage('You must have purchaseId')

],  
validateRequest,
async (req: Request, res: Response) => {
    const {token, purchaseId } = req.body;
    const purchase = await Purchase.findById(purchaseId);
    if(!purchase){
        throw new NotFoundError();
    }
    if(purchase.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    if(purchase.status === PurchaseStatus.Cancelled){
        throw new BadRequestError('Dude, it seems like someone was faster :(');
    }//nakladanie oplaty
    const charge = await stripe.charges.create({
        currency: 'pln',
        amount: purchase.price * 100,
        source: token,
    });//tworzenie obiektu platnosci
    const payment = Payment.build({
        purchaseId,
        stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        purchaseId: payment.purchaseId,
        stripeId: payment.stripeId,
    })
    res.status(201).send({id: payment.purchaseId });
    
});
export{router as createPaymentRouter};