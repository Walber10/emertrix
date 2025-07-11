import { prisma } from '../database/connectToDB';
import { connectToDatabase, disconnectFromDatabase } from '../database/connectToDB';

beforeAll(async () => {
  // Connect to test database
  await connectToDatabase();
});

afterAll(async () => {
  // Cleanup and disconnect
  await disconnectFromDatabase();
});

afterEach(async () => {
  // Clear all tables after each test
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter(name => name !== '_prisma_migrations')
    .map(name => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
});
