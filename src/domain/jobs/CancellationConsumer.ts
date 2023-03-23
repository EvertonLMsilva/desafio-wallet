import { Process, Processor } from '@nestjs/bull';
import { CancellationDto } from 'src/infra/Dto/CancellationDto';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { ErrorProducer } from './ErrorProducer';
import { TypeTransaction } from 'src/enum/TypeTransaction';
import { ReversalProducer } from './ReversalProducer';
import { TransactionRepository } from '../repository/TransactionRepository';

@Injectable()
@Processor('cancellation-queue')
export class CancellationConsumer {
  constructor(
    @Inject('transactionInterface')
    private transactionRepository: TransactionRepository,
    private errorProducer: ErrorProducer,
    private reversalProducer: ReversalProducer,
  ) {}

  @Process('cancellation-job')
  async cancellationJob(job: Job<CancellationDto>) {
    const { data } = job;
    const typeTransaction = TypeTransaction.cancellation;

    try {
      const transaction = await this.transactionRepository
        .getOne({
          codeTransaction: data?.codeTransaction,
          typeTransaction: 'purchase',
        })
        .catch((err) => {
          throw new Error(`Erro ao atualizar transação no banco - 002 ${err}`);
        });

      if (!transaction || !transaction?.active)
        throw new Error(
          !transaction ? 'Transação não encontrada' : 'Transação já cancelada!',
        );

      await this.transactionRepository
        .update(
          {
            idAccount: data?.idAccount,
            codeTransaction: data?.codeTransaction,
            typeTransaction: 'purchase',
            active: true,
          },
          { active: false },
        )
        .catch((err) => {
          throw new Error(`Erro ao atualizar transação no banco - ${err}`);
        });

      await this.transactionRepository
        .save({
          idAccount: data?.idAccount,
          value: transaction?.value,
          codeTransaction: data?.codeTransaction,
          typeTransaction,
          description: data?.description,
        })
        .catch((err) => {
          throw new Error(`Erro ao criar transação no banco - ${err}`);
        });

      await this.reversalProducer
        .createReversal({
          idAccount: data?.idAccount,
          codeTransaction: transaction?.codeTransaction,
          description: transaction?.description,
        })
        .catch((err) => {
          throw new Error(`Erro ao gerar estorno - ${err}`);
        });
    } catch (error) {
      await this.errorProducer.ErrorInJob({
        codeTransaction: data?.codeTransaction,
        description: {
          module: 'transaction',
          specification: typeTransaction,
          message: error.message,
        },
      });
    }
  }
}
