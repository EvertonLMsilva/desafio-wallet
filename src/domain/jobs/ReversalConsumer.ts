import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { ReversalDto } from 'src/Dto/ReversalDto';
import { TypeTransaction } from 'src/enum/TypeTransaction';
import { TransactionModel } from 'src/infra/database/model/TransactionModel';
import { WalletModel } from 'src/infra/database/model/WalletModel';
import { ErrorProducer } from './ErrorProducer';

@Injectable()
@Processor('reversal-queue')
export class ReversalConsumer {
  constructor(
    @Inject('transaction')
    private transactionRepository: typeof TransactionModel,
    @Inject('wallet') private walletRepository: typeof WalletModel,
    private errorProducer: ErrorProducer,
  ) {}

  @Process('reversal-job')
  async reversalJob(job: Job<ReversalDto>) {
    const { data } = job;
    const typeTransaction = TypeTransaction.reversal;

    try {
      const transaction = await this.transactionRepository.findOne({
        where: {
          idAccount: data?.idAccount,
          codeTransaction: data?.codeTransaction,
          typeTransaction: 'purchase',
          active: false,
        },
      });

      if (!transaction?.dataValues && !transaction?.dataValues?.active)
        throw new Error(
          !transaction?.dataValues
            ? 'Transação não encontrada'
            : 'Transação já cancelada!',
        );

      const userWallet = await this.walletRepository.findOne({
        where: { idAccount: data?.idAccount },
      });

      if (!userWallet?.dataValues) throw new Error('Carteira não encontrada!');

      const someValues =
        Number(userWallet?.dataValues.value) +
        Number(transaction?.dataValues?.value);

      await this.walletRepository
        .update(
          { value: someValues },
          { where: { idAccount: data?.idAccount } },
        )
        .catch((err) => {
          throw new Error(
            `Erro ao atualizar carteira no banco de dados - ${err}`,
          );
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
          throw new Error(
            `Erro ao criar transação de estorno no banco de dados - ${err}`,
          );
        });

      console.warn('--------- job consumer reversal', {
        totalReversal: Number(transaction?.dataValues?.value),
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
