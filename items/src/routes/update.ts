import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { // calling all those middlewares
    validateRequest, // request to validate
    NotFoundError, //if the item is not found
    requireAuth, //authethication restrictions
    NotAuthorizedError, //print an error when no cookie
    BadRequestError
} from '@secondchances/common';
import {Item} from '../models/item';
import { ItemUpdatedEvent } from '@secondchances/common';
import { natsWrapper } from '../nats-wrapper';
import { ItemUpdatedPublisher } from '../events/publishers/item-updated-publisher';
const router = express.Router();
//assosiating put method for the router so we create/update a resource there
//actually asking by requireAuth to be authenticated, 
router.put('/api/items/:id', 
requireAuth, //adding check on the body of both
[
 body('title')
 .notEmpty()
 .exists()
 .withMessage('Title is required'),
 body('price')
 .isFloat({gt:0})
 .isDecimal()
 .withMessage("Price can't be lower than 1")

//general request
],validateRequest,async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id); //using our item model, to check if ID of the item is done right
    if(!item) {
        throw new NotFoundError();
    }
    //checking if the item has an purchaseId, which means if it is already taken
    if(item.purchaseId){
        throw new BadRequestError("Taken");
    }
    //so if there is not item like that, we throw an error of not found error
    if (item.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
    item.set({ //changes to the item
        title: req.body.title,
        price: req.body.price,
    }); //to apply update, we can use set command
   await item.save(); //actually saves the data in database
    new ItemUpdatedPublisher(natsWrapper.client).publish({ //after makiing an update, we emmit an event to nats
        id: item.id,
        //version: item.version,
        title: item.title,
        price: item.price,
        userId: item.userId,
    });
    res.send(item);
});

export { router as updateItemRouter}; //wiring up to our app