import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { TransactionDto } from '../../Dto/TransactionDto';
import { TransactionModel } from '../../infra/database/model/TransactionModel';
import { WalletModel } from '../../infra/database/model/WalletModel';
import { TypeTransaction } from '../../enum/TypeTransaction';
import { ErrorProducer } from './ErrorProducer';
import { walletTransactionCalculation } from '../utils/walletTransactionCalculation';

@Injectable()
@Processor('transactionPurchase-queue')
export class PurchaseConsumer {
  constructor(
    @Inject('transaction')
    private transactionRepository: typeof TransactionModel,
    @Inject('wallet') private walletRepository: typeof WalletModel,
    private errorProducer: ErrorProducer,
  ) {}

  @Process('purchaseTransaction-job')
  async purchaseJob(job: Job<TransactionDto>) {
    const { data } = job;
    const typeTransaction = TypeTransaction.purchase;

    try {
      if (data.value < 0)
        throw new Error('Valor informado não pode ser negativo.');

      await this.findDuplicateTransaction(data?.codeTransaction);

      const wallet = await this.walletRepository.findOne({
        where: { idAccount: data?.idAccount },
      });

      const validateWallet = walletTransactionCalculation(
        data?.value,
        typeTransaction,
        { id: wallet?.dataValues?.id, value: wallet?.dataValues?.value },
      );

      if (validateWallet?.type === 'error')
        throw new Error('Saldo insuficiente!');

      await this.transactionRepository
        .create<TransactionModel>({ ...data, typeTransaction })
        .catch((err) => {
          throw new Error(`Erro ao criar transação no banco - ${err}`);
        });

      await this.walletRepository
        .update<WalletModel>(
          { value: validateWallet.HasBalance },
          { where: { id: Number(validateWallet?.idWallet) } },
        )
        .catch((err) => {
          throw new Error(`Erro ao atualizar carteira de usuário - ${err}`);
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

  private async findDuplicateTransaction(
    codeTransaction: string,
  ): Promise<void> {
    await this.transactionRepository
      .findOne({
        where: { codeTransaction },
      })
      .then((resolve) => {
        if (resolve) throw new Error('Transação já realizada.');
      });
  }
}
