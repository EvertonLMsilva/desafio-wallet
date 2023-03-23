import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { ReversalDto } from 'src/infra/Dto/ReversalDto';
import { TypeTransaction } from 'src/enum/TypeTransaction';
import { TransactionRepository } from '../repository/TransactionRepository';
import { WalletRepository } from '../repository/WalletRepository';
import { ErrorProducer } from './ErrorProducer';

@Injectable()
@Processor('reversal-queue')
export class ReversalConsumer {
  constructor(
    @Inject('transactionInterface')
    private transactionRepository: TransactionRepository,
    @Inject('walletInterface')
    private walletRepository: WalletRepository,
    private errorProducer: ErrorProducer,
  ) {}

  @Process('reversal-job')
  async reversalJob(job: Job<ReversalDto>) {
    const { data } = job;
    const typeTransaction = TypeTransaction.reversal;

    try {
      const transaction = await this.transactionRepository.getOne({
        idAccount: data?.idAccount,
        codeTransaction: data?.codeTransaction,
        typeTransaction: 'purchase',
        active: false,
      });

      if (!transaction && !transaction?.active)
        throw new Error(
          !transaction ? 'Transação não encontrada' : 'Transação já cancelada!',
        );

      const userWallet = await this.walletRepository.getOne({
        idAccount: data?.idAccount,
      });

      if (!userWallet) throw new Error('Carteira não encontrada!');

      const someValues = Number(userWallet?.value) + Number(transaction?.value);

      await this.walletRepository
        .update(data?.idAccount, { value: someValues })
        .catch((err) => {
          throw new Error(
            `Erro ao atualizar carteira no banco de dados - ${err}`,
          );
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
          throw new Error(
            `Erro ao criar transação de estorno no banco de dados - ${err}`,
          );
        });

      console.warn('--------- job consumer reversal', {
        totalReversal: Number(transaction?.value),
        totalWallet: someValues,
        typeTransaction,
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
