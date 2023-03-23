import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { TransactionWithdrawalDto } from 'src/infra/Dto/TransactionWithdrawalDto';
import { TransactionDepositDto } from 'src/infra/Dto/TransactionDepositDto';
import { ReturnMessageType } from '../types/ReturnMessageType';

@Injectable()
export class TransactionProducer {
  constructor(@InjectQueue('transactionDeposit-queue') private queue: Queue) {}

  async depositProducer(
    depositTransactionDto: TransactionDepositDto,
  ): Promise<ReturnMessageType> {
    try {
      if (depositTransactionDto.value <= 0)
        throw new Error('Valor informado não pode ser negativo ou 0.');

      const codeTransaction = randomUUID();
      await this.queue.add('depositTransaction-job', {
        ...depositTransactionDto,
        codeTransaction,
      });

      return { message: 'Deposito em analise!' };
    } catch (error) {
      return { message: error?.message };
    }
  }

  async withdrawalProducer(
    withdrawalTransactionDto: TransactionWithdrawalDto,
  ): Promise<ReturnMessageType> {
    try {
      if (withdrawalTransactionDto.value <= 0)
        throw new Error('Valor informado não pode ser negativo ou 0.');

      const codeTransaction = randomUUID();
      await this.queue.add('withdrawalTransaction-job', {
        ...withdrawalTransactionDto,
        codeTransaction,
      });

      return { message: 'Saque em analise!' };
    } catch (error) {
      return { message: error?.message };
    }
  }
}
