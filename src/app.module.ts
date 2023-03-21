import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeAdapter } from './infra/database/SequelizeAdapter';
import { TransactionApplication } from './application/TransactionApplication';
import { TransactionProducer } from './domain/jobs/TransactionProducer';
import { TransactionConsumer } from './domain/jobs/TransactionConsumer';
import { WalletModel } from './infra/database/model/WalletModel';
import { TransactionModel } from './infra/database/model/TransactionModel';
import { ErrorTransactionProducer } from './domain/jobs/ErrorTransactionProducer';
import { ErrorTransactionConsumer } from './domain/jobs/ErrorTransactionConsumer';
import { BankStatementRepository } from './infra/repository/BankStatementRepository';
import { BankStatementApplication } from './application/BankStatementApplication';
import { PurchaseApplication } from './application/PurchaseApplication';
import { PurchaseRepository } from './domain/jobs/PurchaseProducer';
import { PurchaseConsumer } from './domain/jobs/PurchaseConsumer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.develop'
    }),
    BullModule.registerQueue(
      {name: "transactionPurchase-queue"}
    ),
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
  controllers: [TransactionApplication, BankStatementApplication, PurchaseApplication],
  providers: [
    ...SequelizeAdapter,
    ErrorTransactionProducer,
    ErrorTransactionConsumer,
    TransactionProducer,
    TransactionConsumer,
    PurchaseConsumer,
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
    PurchaseRepository
  ],
  exports: [...SequelizeAdapter]
})
export class AppModule { }
