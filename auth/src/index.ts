import mongoose from 'mongoose';
import {app} from './app'; 

const start = async () => {
  if (!process.env.jwt_key) {
    throw new Error('jwt_key must be defined');
  }
  if (!process.env.DB_URI) {
    throw new Error('jDB_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.DB_URI);

    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();

