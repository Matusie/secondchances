import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

declare global {
    var signin: () => string[];
  }

let mongo: any;
beforeAll(async () => {
  jest.clearAllMocks();
    process.env.jwt_key = 'pbs';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
    });

beforeEach(async () =>{
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.connection.close();
  });

  global.signin = () => {
    // buidling JWT payload
    const payload = {
      email: 'pbs@pbs.com',
      id: new mongoose.Types.ObjectId().toHexString()
    };
    // Creating the JWT
    const token = jwt.sign(payload, process.env.jwt_key!);
    //Build session Object {jwt: jwt}
    const session = { jwt: token };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // take json and encode it as b64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    ///return a string thats the cookie with the encoded data
    return [`session=${base64}`];
  
  };