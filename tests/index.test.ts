import { Document, Schema, Model, model, connect, connection } from 'mongoose';
import { runInTransaction } from '../pkg';

interface User extends Document {
  name: string;
  balance: number;
}

const userSchema = new Schema({
  name: String,
  balance: Number
});

const UserModel: Model<User> = model<User>('User', userSchema);

describe('Transaction', () => {
  beforeAll(async () => {
    await connect(
      'mongodb://localhost:27017,localhost:27018,localhost:27019/pkg-test?replicaSet=rs'
    );

    // @ts-ignore
    UserModel.createCollection();

    await UserModel.deleteOne({ name: 'John' }).exec();

    await UserModel.create([{ name: 'John', balance: 50 }]);
  });

  it('does not commit if error occurs', async () => {
    await expect(
      runInTransaction(async session => {
        await UserModel.updateOne({ name: 'John' }, { $set: { balance: 30 } }, { session }).exec();

        throw new Error('Dummy Error To Stop the Transaction.');
      })
    ).rejects.toBeDefined();

    const john = await UserModel.findOne({ name: 'John' }).exec();
    expect(john.balance).toEqual(50);
  });

  it('commits changes if no error occur', async () => {
    await expect(
      runInTransaction(async session => {
        await UserModel.updateOne({ name: 'John' }, { $set: { balance: 30 } }, { session }).exec();
      })
    ).resolves.toBeUndefined();

    const john = await UserModel.findOne({ name: 'John' }).exec();
    expect(john.balance).toEqual(30);
  });

  afterAll(() => connection.close());
});
