import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;

//Setup DataBase
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Reset all data before Each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// Close DB connections
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
