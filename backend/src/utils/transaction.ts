import mongoose from 'mongoose';

/**
 * Utility function to handle MongoDB transactions with automatic session management
 * @param operation - The operation to perform within the transaction
 * @returns Promise<T> - The result of the operation
 */
export async function withTransaction<T>(
  operation: (session: mongoose.ClientSession) => Promise<T>,
): Promise<T> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
