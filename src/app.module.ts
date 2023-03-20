import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeAdapter } from './infra/database/SequelizeAdapter';
import { TransactionController } from './application/TransactionController';
import { TransactionProducer } from './jobs/TransactionProducer';
import { TransactionConsumer } from './jobs/TransactionConsumer';
import { WalletModel } from './infra/database/model/WalletModel';
import { TransactionModel } from './infra/database/model/TransactionModel';
import { ErrorTransactionProducer } from './jobs/ErrorTransactionProducer';
import { ErrorTransactionConsumer } from './jobs/ErrorTransactionConsumer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.develop'
    }),
    BullModule.registerQueue(
      {name: "transactionDeposit-queue"}
    ),
    BullModule.registerQueue({
      name: "errorTransactionDeposit-queue"
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      },
    }),
  ],
  controllers: [TransactionController],
  providers: [
    ...SequelizeAdapter,
    ErrorTransactionProducer,
    ErrorTransactionConsumer,
    TransactionProducer,
    TransactionConsumer,
    {
      provide: 'wallet',
      useValue: WalletModel,
    },
    {
      provide: 'transaction',
      useValue: TransactionModel,
    },
  ],
  exports: [...SequelizeAdapter]
})
export class AppModule { }
