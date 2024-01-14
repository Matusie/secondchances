import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@secondchances/common';
import { body } from 'express-validator';
import { Comment } from '../models/comment';
import { User } from '../models/user';
// import { ItemCreatedPublisher} from '../events/publishers/item-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();


router.post(
    '/api/comments',
    requireAuth,
    [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('rating').not().isEmpty().withMessage('Rating is required').isFloat({ min: 1 }).withMessage('Rating has to be minimum 1 ').isFloat({ max: 5 }).withMessage('Rating cannot be more than 5'),
    body('description').not().isEmpty().withMessage('Description is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { title, rating, description, userId} = req.body;
  
      const comment = Comment.build({
        title,
        description,
        rating,
        authorId: req.currentUser!.id,
        userId: userId,
      });
      await comment.save(); //right after saving the item, we want to publish it and pass the object
    //   new ItemCreatedPublisher(natsWrapper.client).publish({ //we are making sure that nats is already running by using natswrapper
    //     id: item.id, //we are using item.id structure because title itself might differ from what it is saved
    //     title: item.title,
    //     //version: item.version,
    //     description: item.description ?? '',
    //     price: item.price,
    //     userId: item.userId,
    //     avatar: item.avatar ?? ''
        
      res.status(201).send(comment);
    });

  
  export { router as addCommentRouter };