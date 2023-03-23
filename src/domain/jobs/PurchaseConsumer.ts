import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { TransactionDto } from '../dto/TransactionDto';
import { TypeTransaction } from '../../enum/TypeTransaction';
import { ErrorProducer } from './ErrorProducer';
import { walletTransactionCalculation } from '../utils/walletTransactionCalculation';
import { TransactionRepository } from '../repository/TransactionRepository';
import { WalletRepository } from '../repository/WalletRepository';

@Injectable()
@Processor('transactionPurchase-queue')
export class PurchaseConsumer {
  constructor(
    @Inject('transactionInterface')
    private transactionRepository: TransactionRepository,
    @Inject('walletInterface')
    private walletRepository: WalletRepository,
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

      const wallet = await this.walletRepository.getOne({
        idAccount: data?.idAccount,
      });

      const validateWallet = walletTransactionCalculation(
        data?.value,
        typeTransaction,
        {
          idAccount: wallet?.idAccount,
          value: wallet?.value,
        },
      );

      if (validateWallet?.type === 'error')
        throw new Error('Saldo insuficiente!');

      await this.transactionRepository
        .save({ ...data, typeTransaction })
        .catch((err) => {
          throw new Error(`Erro ao criar transação no banco - ${err}`);
        });

      await this.walletRepository
        .update(validateWallet?.idAccount, { value: validateWallet.newValue })
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
      .getOne({ codeTransaction })
      .then((resolve) => {
        if (resolve) throw new Error('Transação já realizada.');
      });
  }
}
