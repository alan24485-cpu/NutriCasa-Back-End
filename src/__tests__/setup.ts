/// <reference types="jest" />
import mongoose from 'mongoose';

const MONGO_TEST_URI =
  process.env.MONGO_TEST_URI ||
  'mongodb://localhost:27017/nutricasa_test';

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});