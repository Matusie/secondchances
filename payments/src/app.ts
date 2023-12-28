import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@secondchances/common';
import { createPaymentRouter } from './routes/add';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true,

  
}));
app.use(currentUser);
app.use(createPaymentRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
//connecting to the mongodb instance, BUT first we check jwt key

export { app };