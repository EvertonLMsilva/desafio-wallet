import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { Queue } from 'bull';
import { CancellationDto } from 'src/Dto/CancellationDto';
import { TransactionModel } from 'src/infra/database/model/TransactionModel';

type ReturnCancellationType = {
  message: string;
};

@Injectable()
export class CancellationProducer {
  constructor(
    @InjectQueue('cancellation-queue') private queue: Queue,
    @Inject('transaction')
    private transactionRepository: typeof TransactionModel,
  ) {}

  async createCancellation(
    cancellationDto: CancellationDto,
  ): Promise<ReturnCancellationType> {
    try {
      const codeTransaction = await this.transactionRepository.findOne({
        where: {
          codeTransaction: cancellationDto?.codeTransaction,
          typeTransaction: 'purchase',
          active: true,
        },
      });

      if (codeTransaction?.dataValues)
        throw new Error('Código de transação não encontrado!');

      console.log(codeTransaction?.dataValues);

      await this.queue.add('cancellation-job', cancellationDto);

      return { message: 'Cancelamento em analise!' };
    } catch (error) {
      return { message: error?.message };
    }
  }
}
