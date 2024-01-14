import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { PasswordManager } from '../services/password-manager';
import { User } from '../models/user';
import { validateRequest } from '@secondchances/common';
import { BadRequestError } from '@secondchances/common';
const router = express.Router();

router.post('/api/users/signin',
[
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
    .isLength({ min: 4, max: 20 })
    .withMessage('Wrong length'),
],
validateRequest,
// in our route handler now, we need to use async syntax (async-await)
async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // query that looks for existing user that has same email
  const existingUser = await User.findOne({ email});
 // if we will fail to find one, we want to throw an error 
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }
  // comparing passwords
  const passwordsMatch = await PasswordManager.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials');
  }
  //Generowanie JWT
  const userJwt =jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, 
  process.env.jwt_key!
  );
// Przechowywanie JWT w sesji
  req.session = {
    jwt: userJwt
  };
// Zwrot odpowiedzi
  res.status(200).send(existingUser);
}

  
);

  //     const errors = validationResult(req);

  //     if(!errors.isEmpty()){
  //       throw new RequestValidationError(errors.array());
  //     }


export { router as signinRouter };
