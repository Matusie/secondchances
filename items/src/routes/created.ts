import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { // calling all those middlewares
    validateRequest, // request to validate
    NotFoundError, //if the item is not found
    requireAuth, //authethication restrictions
    NotAuthorizedError //print an error when no cookie
} from '@secondchances/common';
import {Item} from '../models/item';
const router = express.Router();
//assosiating put method for the router so we create/update a resource there
//actually asking by requireAuth to be authenticated, 
router.get('/api/itemsCreatedBy/:id', 
[
//general request
],validateRequest,async (req: Request, res: Response) => {
    const id = req.params.id;
    const items= await Item.find({userId: id})
    
    res.send({createdBy:id,items:items.map(item=>({
        
        title:item.title,
        price:item.price,
        id:item.id
    
}))});
});

export { router as showCreatedByItemRouter}; //wiring up to our app