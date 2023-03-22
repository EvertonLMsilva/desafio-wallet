import { Process, Processor } from '@nestjs/bull';
import { CancellationDto } from 'src/Dto/CancellationDto';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { TransactionModel } from 'src/infra/database/model/TransactionModel';
import { ErrorProducer } from './ErrorProducer';
import { TypeTransaction } from 'src/enum/TypeTransaction';
import { ReversalProducer } from './ReversalProducer';

@Injectable()
@Processor('cancellation-queue')
export class CancellationConsumer {
  constructor(
    @Inject('transaction')
    private transactionRepository: typeof TransactionModel,
    private errorProducer: ErrorProducer,
    private reversalProducer: ReversalProducer,
  ) {}

  @Process('cancellation-job')
  async cancellationJob(job: Job<CancellationDto>) {
    const { data } = job;
    const typeTransaction = TypeTransaction.cancellation;

    try {
      const transaction = await this.transactionRepository.findOne({
        where: {
          idAccount: data?.idAccount,
          codeTransaction: data?.codeTransaction,
          typeTransaction: 'purchase',
        },
      });

      if (!transaction?.dataValues && !transaction?.dataValues?.active)
        throw new Error(
          !transaction?.dataValues
            ? 'Transação não encontrada'
            : 'Transação já cancelada!',
        );

      await this.transactionRepository
        .update(
          { active: false },
          {
            where: {
              idAccount: data?.idAccount,
              codeTransaction: data?.codeTransaction,
            },
          },
        )
        .catch((err) => {
          throw new Error(`Erro ao atualizar transação no banco - ${err}`);
        });

      await this.transactionRepository
        .create<TransactionModel>({
          idAccount: data?.idAccount,
          value: transaction?.dataValues?.value,
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
          codeTransaction: transaction?.dataValues?.codeTransaction,
          description: transaction?.dataValues?.description,
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
