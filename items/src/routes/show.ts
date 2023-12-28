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
router.get('/api/items/:id', 
[
//general request
],validateRequest,async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id); //using our item model, to check if ID of the item is done right
    if(!item) {
        throw new NotFoundError();
    } //so if there is not item like that, we throw an error of not found error
    

    res.send(item);
});

export { router as showItemRouter}; //wiring up to our app