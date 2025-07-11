import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
export const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.__prisma = prisma;
}

/**
 * @function connectToDatabase
 * @description Connects to the PostgreSQL database using Prisma.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
export const connectToDatabase = async () => {
  if (!process.env.DATABASE_PUBLIC_URL) {
    throw new Error('Please specify the DATABASE_PUBLIC_URL in the .env file.');
  }

  try {
    await prisma.$connect();
    console.log('Connected to the database 🧰');
  } catch (err) {
    console.error('Error connecting to the database: ', err);
    throw err;
  }
};

export const disconnectFromDatabase = async () => {
  await prisma.$disconnect();
};
