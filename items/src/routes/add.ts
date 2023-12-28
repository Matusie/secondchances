import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@secondchances/common';
import { body } from 'express-validator';
import { Item } from '../models/item';
import { ItemCreatedPublisher} from '../events/publishers/item-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();


router.post(
    '/api/items',
    requireAuth,
    [
      body('title').not().isEmpty().withMessage('Title is required'),
      body('price')
        .isFloat({ gt: 0 })
        .withMessage('No co za debil....'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { title, price } = req.body;
  
      const item = Item.build({
        title,
       // description,
        price,
        userId: req.currentUser!.id
      });
      await item.save(); //right after saving the item, we want to publish it and pass the object
      new ItemCreatedPublisher(natsWrapper.client).publish({ //we are making sure that nats is already running by using natswrapper
        id: item.id, //we are using item.id structure because title itself might differ from what it is saved
        title: item.title,
        //version: item.version,
        price: item.price,
        userId: item.userId,
        
      });
      res.status(201).send(item);
    }
  );
  
  export { router as addItemRouter };