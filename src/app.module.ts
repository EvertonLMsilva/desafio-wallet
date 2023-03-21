import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeAdapter } from './infra/database/SequelizeAdapter';
import { TransactionController } from './application/TransactionApplication';
import { TransactionProducer } from './domain/jobs/TransactionProducer';
import { TransactionConsumer } from './domain/jobs/TransactionConsumer';
import { WalletModel } from './infra/database/model/WalletModel';
import { TransactionModel } from './infra/database/model/TransactionModel';
import { ErrorTransactionProducer } from './domain/jobs/ErrorTransactionProducer';
import { ErrorTransactionConsumer } from './domain/jobs/ErrorTransactionConsumer';
import { BankStatementRepository } from './infra/repository/BankStatementRepository';
import { BankStatementApplication } from './application/BankStatementApplication';

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
  controllers: [TransactionController, BankStatementApplication],
  providers: [
    ...SequelizeAdapter,
    ErrorTransactionProducer,
    ErrorTransactionConsumer,
    TransactionProducer,
    TransactionConsumer,
    BankStatementRepository,
    {
      provide: 'wallet',
      useValue: WalletModel,
    },
    {
      provide: 'transaction',
      useValue: TransactionModel,
    },
    BankStatementRepository,
  ],
  exports: [...SequelizeAdapter]
})
export class AppModule { }
