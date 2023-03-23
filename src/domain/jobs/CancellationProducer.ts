import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { Queue } from 'bull';
import { CancellationDto } from 'src/infra/Dto/CancellationDto';
import { TransactionRepository } from '../repository/TransactionRepository';

type ReturnCancellationType = {
  message: string;
};

@Injectable()
export class CancellationProducer {
  constructor(
    @InjectQueue('cancellation-queue') private queue: Queue,
    @Inject('transactionInterface')
    private transactionRepository: TransactionRepository,
  ) {}

  async createCancellation(
    cancellationDto: CancellationDto,
  ): Promise<ReturnCancellationType> {
    try {
      const codeTransaction = await this.transactionRepository.getOne({
        codeTransaction: cancellationDto?.codeTransaction,
        typeTransaction: 'purchase',
      });

      if (!codeTransaction)
        throw new Error('Código de transação não encontrado!');
      if (!codeTransaction.active)
        throw new Error('Transação já cancelada!');

      await this.queue.add('cancellation-job', cancellationDto);

      return { message: 'Cancelamento em analise!' };
    } catch (error) {
      return { message: error?.message };
    }
  }
}
