import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@secondchances/common';
import { addItemRouter } from './routes/add';
import { showItemRouter } from './routes/show';
import { indexItemRouter } from './routes/index';
import { updateItemRouter} from './routes/update';
import { showCreatedByItemRouter } from './routes/created';
import { deleteItemRouter } from './routes/delete';
const app = express();
app.set('trust proxy', true);
app.use(json({ limit: '250kb' }));
app.use(cookieSession({
  signed: false,
  secure: true,

  
}));
app.use(currentUser);

app.use(addItemRouter);
app.use(showItemRouter);
app.use(indexItemRouter);
app.use(showCreatedByItemRouter)
app.use(updateItemRouter);
app.use(deleteItemRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
//connecting to the mongodb instance, BUT first we check jwt key

export { app };