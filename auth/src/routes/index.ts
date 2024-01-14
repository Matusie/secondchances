import express from 'express';
// import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { validateRequest } from '@secondchances/common';

const router = express.Router();

router.get('/api/users/',validateRequest,async (req, res) => {
  const users = await User.find({}, 'email firstName lastName avatar')
  res.send({ users: users});
});

export { router as indexUserRouter };
