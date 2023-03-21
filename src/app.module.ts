import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeAdapter } from './infra/database/SequelizeAdapter';
import { TransactionApplication } from './application/TransactionApplication';
import { TransactionProducer } from './domain/jobs/TransactionProducer';
import { TransactionConsumer } from './domain/jobs/TransactionConsumer';
import { WalletModel } from './infra/database/model/WalletModel';
import { TransactionModel } from './infra/database/model/TransactionModel';
import { ErrorProducer } from './domain/jobs/ErrorProducer';
import { ErrorConsumer } from './domain/jobs/ErrorConsumer';
import { BankStatementRepository } from './infra/repository/BankStatementRepository';
import { BankStatementApplication } from './application/BankStatementApplication';
import { PurchaseApplication } from './application/PurchaseApplication';
import { PurchaseProducer } from './domain/jobs/PurchaseProducer';
import { PurchaseConsumer } from './domain/jobs/PurchaseConsumer';
import { CancellationProducer } from './domain/jobs/CancellationProducer';
import { CancellationConsumer } from './domain/jobs/CancellationConsumer';
import { CancellationApplication } from './application/CancellationApplication';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.develop'
    }),
    BullModule.registerQueue(
      { name: "transactionPurchase-queue" }
    ),
    BullModule.registerQueue(
      { name: "transactionDeposit-queue" }
    ),
    BullModule.registerQueue({
      name: "errorTransaction-queue"
    }),
    BullModule.registerQueue({
      name: "cancellation-queue"
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      },
    }),
  ],
  controllers: [
    TransactionApplication, 
    BankStatementApplication, 
    PurchaseApplication, 
    CancellationApplication
  ],
  providers: [
    ...SequelizeAdapter,
    ErrorProducer,
    ErrorConsumer,
    TransactionProducer,
    TransactionConsumer,
    PurchaseConsumer,
    BankStatementRepository,
    CancellationProducer,
    CancellationConsumer,
    {
      provide: 'wallet',
      useValue: WalletModel,
    },
    {
      provide: 'transaction',
      useValue: TransactionModel,
    },
    BankStatementRepository,
    PurchaseProducer
  ],
  exports: [...SequelizeAdapter]
})
export class AppModule { }
