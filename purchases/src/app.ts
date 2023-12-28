import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@secondchances/common';
import { deletePurchaseRouter } from './routes/delete';
import { addPurchaseRouter } from './routes/add';
import { showPurchaseRouter } from './routes/show';
import { indexPurchaseRouter } from './routes/index';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true,
  
}));
app.use(currentUser);

app.use(indexPurchaseRouter);
app.use(showPurchaseRouter);
app.use(addPurchaseRouter);
app.use(deletePurchaseRouter );
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
//connecting to the mongodb instance, BUT first we check jwt key

export { app };