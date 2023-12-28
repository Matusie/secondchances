import express, { Request, Response } from 'express';
import { Item } from '../models/item';
// import {Purchase} from '../../../purchases/src/models/purchase'

const router = express.Router();

router.get('/api/items', async (req: Request, res: Response) =>{
const items = await Item.find({purchaseId: undefined}) // empty string to say give us all the objects in the collection // changed it so we show only avaiable
res.send(items); // we are taking all of them and sending after wiring up
});

export { router as indexItemRouter };