import mongoose from 'mongoose';

/**
 * @function connectToDatabase
 * @description Connects to the MongoDB database using the URI specified in environment variables.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
export const connectToDatabase = async () => {
  if (!process.env.MONG_URI) {
    throw new Error('Please specify the MongoDB URI in the .env file.');
  }

  try {
    await mongoose.connect(process.env.MONG_URI);
    console.log('Connected to the database 🧰');
  } catch (err) {
    console.error('Error connecting to the database: ', err);
    throw err;
  }
};

export const disconnectFromDatabase = async () => {
  await mongoose.disconnect();
};
