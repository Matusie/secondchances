import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import  jwt  from 'jsonwebtoken';

import { validateRequest } from '@secondchances/common';
import { User } from "../models/user";
import { BadRequestError } from '@secondchances/common';
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  // we remove this part of the code because it is in the middleware now
  async (req: Request, res: Response) => {
  //   const errors = validationResult(req);

  //   if (!errors.isEmpty()) {
  //     throw new RequestValidationError(errors.array());
  //   }

    const {firstName, lastName, terms, avatar, email, password } = req.body;
    const existingUser = await User.findOne({ email});

    if (existingUser) {
      // console.log ('Email in use');
      // return res.send({});
      throw new BadRequestError('Email in use');
    }

    const user = User.build({firstName, lastName, avatar, terms, email, password });
    await user.save();

//Generate JWT
    const userJwt =jwt.sign({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar
    }, 
    process.env.jwt_key!
    );
// store it on the session
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }

    
);

export { router as signupRouter };

