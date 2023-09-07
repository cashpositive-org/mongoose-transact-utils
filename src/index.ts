import mongoose, { ClientSession, Connection } from 'mongoose';

export type MutationCallback<T> = (session: ClientSession) => Promise<T>;

/**
 * Runs the provided `mutations` callback within a transaction and commits the changes to the DB
 * only when it has run successfully.
 *
 * @param mutations A callback which does DB writes and reads using the session.
 */
export async function runInTransaction<T>(mutations: MutationCallback<T>, connection?: Connection): Promise<T> {
  let session: ClientSession;
  if(connection){
    session =await connection.startSession()
  } else {
    session = await mongoose.startSession();
  }

  session.startTransaction();
  try {
    const value = await mutations(session);

    // Since the mutations ran without an error, commit the transaction.
    await session.commitTransaction();

    // Return any value returned by `mutations` to make this function as transparent as possible.
    return value;
  } catch (error) {
    // Abort the transaction as an error has occurred in the mutations above.
    await session.abortTransaction();

    // Rethrow the error to be caught by the caller.
    throw error;
  } finally {
    // End the previous session.
    session.endSession();
  }
}
