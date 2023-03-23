import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ReversalDto } from 'src/infra/Dto/ReversalDto';
import { TypeTransaction } from 'src/enum/TypeTransaction';
import { TransactionRepository } from '../repository/TransactionRepository';
import { ErrorProducer } from './ErrorProducer';

@Injectable()
export class ReversalProducer {
  constructor(
    @InjectQueue('reversal-queue') private queue: Queue,
    private errorProducer: ErrorProducer,
    @Inject('transactionInterface')
    private transactionRepository: TransactionRepository,
  ) {}

  async createReversal(reversalDto: ReversalDto): Promise<void> {
    const typeTransaction = TypeTransaction.error;

    const codeTransaction = await this.transactionRepository.getOne({
      codeTransaction: reversalDto?.codeTransaction,
      typeTransaction: 'purchase',
      active: false,
    });

    if (!codeTransaction)
      throw new Error('Código de transação não encontrado!');

    await this.queue.add('reversal-job', reversalDto).catch(async () => {
      await this.errorProducer.ErrorInJob({
        codeTransaction: codeTransaction.codeTransaction,
        description: {
          module: 'transaction',
          specification: typeTransaction,
          message: 'Erro no cadastrar de estorno a fila.',
        },
      });
    });
  }
}
