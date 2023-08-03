import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Logger } from '@movesfinancial/typescript-log';

export class InMemoryMongoManager {
  private mongoMemory: MongoMemoryReplSet | MongoMemoryServer;
  private logger: Logger;
  private isReplSet: boolean;

  /**
   * Creates a new instance of InMemoryMongoManager
   * @param logger
   * @param isReplSet set to true if usage of change streams or transactions are needed
   *   see https://docs.mongodb.com/manual/changeStreams/#availability and
   *   see https://docs.mongodb.com/manual/core/transactions/#transactions-and-atomicity
   */
  public constructor(logger: Logger, isReplSet = true) {
    this.isReplSet = isReplSet;
    this.mongoMemory = isReplSet ? new MongoMemoryReplSet() : new MongoMemoryServer();
    this.logger = logger;
  }

  private startMongoMemoryServer = async (): Promise<MongoMemoryServer> => {
    const server = await MongoMemoryServer.create({ binary: { version: '5.0.18' } });
    await server.ensureInstance();
    return server;
  };

  private startMongoMemoryReplSet = async (): Promise<MongoMemoryReplSet> => {
    const server = new MongoMemoryReplSet({
      replSet: { storageEngine: 'wiredTiger' },
      binary: { version: '5.0.18' },
    });
    await server.start();
    return server;
  };

  public start = async (): Promise<string> => {
    this.mongoMemory = this.isReplSet
      ? await this.startMongoMemoryReplSet()
      : await this.startMongoMemoryServer();
    const uri = await this.mongoMemory.getUri();
    await mongoose.connect(
      uri,
       {
        autoCreate: true,

    });
    return uri;
  };

  public stop = async (): Promise<void> => {
    await mongoose.disconnect()
    if (this.mongoMemory) {
      this.logger.info(`in-memory mongo shutting down ...`);
      await this.mongoMemory.stop();
    }
    this.logger.info(`in-memory mongo shut down`);
  };
}
