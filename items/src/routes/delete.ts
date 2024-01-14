import express,{ Request, Response} from 'express';

import { Item } from '../models/item';
import { validateRequest } from '@secondchances/common';
const router = express.Router();

// DELETE /items/:id
router.delete('/api/items/:id',validateRequest, async (req:Request, res:Response) => {
    const itemId = req.params.id;

    try {
        // Usuń przedmiot o podanym ID
        await Item.findByIdAndDelete(itemId);

        res.send(`Usunięto przedmiot o ID: ${itemId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Wystąpił błąd podczas usuwania przedmiotu');
    }
});

export { router as deleteItemRouter };