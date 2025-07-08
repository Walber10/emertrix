import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../database/connectToDB';

beforeAll(async () => {
  // Connect to test database
  await connectToDatabase();
});

afterAll(async () => {
  // Cleanup
  await disconnectFromDatabase();
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
