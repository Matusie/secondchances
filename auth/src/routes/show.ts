import express, { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { validateRequest } from '@secondchances/common';

const router = express.Router();

router.get('/api/users/:userId', async (req:Request, res:Response) => {
    const user = await User.findById(req.params.userId );
    res.send( user );
});

export { router as showUserRouter };




