import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@secondchances/common';
import { addCommentRouter } from './routes/add';
import { indexCommentRouter } from './routes/index';
import { deleteCommentRouter } from './routes/delete';
import { showCommentRouter } from './routes/show';
import { indexUserCommentRouter } from './routes/user-index';
import { userIndexCommentRouter } from './routes/userComments'
const app = express();
app.set('trust proxy', true);
app.use(json({ limit: '250kb' }));
app.use(cookieSession({
  signed: false,
  secure: true,

  
}));

app.use(currentUser);
app.use(deleteCommentRouter);
app.use(showCommentRouter);
app.use(indexCommentRouter);
app.use(addCommentRouter);
app.use(userIndexCommentRouter);
app.use(indexUserCommentRouter);

// app.all('*', async (req, res) => {
//   throw new NotFoundError();
// });

app.use(errorHandler);
//connecting to the mongodb instance, BUT first we check jwt key

export { app };