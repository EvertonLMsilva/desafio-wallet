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
import { BankStatementApplication } from './application/BankStatementApplication';
import { PurchaseApplication } from './application/PurchaseApplication';
import { PurchaseProducer } from './domain/jobs/PurchaseProducer';
import { PurchaseConsumer } from './domain/jobs/PurchaseConsumer';
import { CancellationProducer } from './domain/jobs/CancellationProducer';
import { CancellationConsumer } from './domain/jobs/CancellationConsumer';
import { CancellationApplication } from './application/CancellationApplication';
import { ReversalProducer } from './domain/jobs/ReversalProducer';
import { ReversalConsumer } from './domain/jobs/ReversalConsumer';
import { BalanceApplication } from './application/BalanceApplication';
import { TransactionDatabaseRepository } from './infra/repository/TransactionDatabaseRepository';
import { WalletDatabaseRepository } from './infra/repository/WalletDatabaseRepository';
import { BankStatementService } from './domain/services/BankStatementService';
import { BankStatementDatabaseRepository } from './infra/repository/BankStatementDatabaseRepository';
import { BalanceService } from './domain/services/BalanceService';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${
        process.env.NODE_ENV ? '.' + process.env.NODE_ENV.trim() : ''
      }`,
      isGlobal: true,
    }),
    BullModule.registerQueue({ name: 'transactionPurchase-queue' }),
    BullModule.registerQueue({ name: 'transactionDeposit-queue' }),
    BullModule.registerQueue({
      name: 'errorTransaction-queue',
    }),
    BullModule.registerQueue({
      name: 'cancellation-queue',
    }),
    BullModule.registerQueue({
      name: 'reversal-queue',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [
    TransactionApplication,
    BankStatementApplication,
    PurchaseApplication,
    CancellationApplication,
    BalanceApplication,
  ],
  providers: [
    ...SequelizeAdapter,
    ErrorProducer,
    ErrorConsumer,
    TransactionProducer,
    TransactionConsumer,
    PurchaseConsumer,
    CancellationProducer,
    CancellationConsumer,
    ReversalProducer,
    ReversalConsumer,
    PurchaseProducer,
    BankStatementService,
    BalanceService,
    WalletDatabaseRepository,
    TransactionDatabaseRepository,
    BankStatementDatabaseRepository,
    {
      provide: 'wallet',
      useValue: WalletModel,
    },
    {
      provide: 'transaction',
      useValue: TransactionModel,
    },
    {
      provide: 'walletInterface',
      useExisting: WalletDatabaseRepository,
    },
    {
      provide: 'transactionInterface',
      useExisting: TransactionDatabaseRepository,
    },
    {
      provide: 'BankStatementInterface',
      useExisting: BankStatementDatabaseRepository,
    },
  ],
  exports: [...SequelizeAdapter],
})
export class AppModule {}
