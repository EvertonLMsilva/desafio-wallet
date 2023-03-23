import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { TypeTransaction } from '../../enum/TypeTransaction';
import { ErrorProducer } from './ErrorProducer';
import { TransactionConsumerDto } from 'src/infra/Dto/TransactionConsumerDto';
import { walletTransactionCalculation } from '../utils/walletTransactionCalculation';
import { TransactionRepository } from '../repository/TransactionRepository';
import { WalletRepository } from '../repository/WalletRepository';

@Injectable()
@Processor('transactionDeposit-queue')
export class TransactionConsumer {
  constructor(
    @Inject('walletInterface')
    private walletRepository: WalletRepository,
    @Inject('transactionInterface')
    private transactionRepository: TransactionRepository,
    private errorProducer: ErrorProducer,
  ) {}

  @Process('depositTransaction-job')
  async depositJob(job: Job<TransactionConsumerDto>) {
    const { data } = job;
    const typeTransaction = TypeTransaction.deposit;

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
        { idAccount: data?.idAccount, value: wallet?.value },
      );

      await this.transactionRepository
        .save({
          idAccount: data.idAccount,
          value: data.value,
          codeTransaction: data.codeTransaction,
          description: data.description,
          typeTransaction,
        })
        .catch((err) => {
          throw new Error(`Erro ao criar transação no banco - ${err}`);
        });

      await this.walletRepository
        .update(validateWallet?.idAccount, { value: validateWallet?.newValue })
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

  @Process('withdrawalTransaction-job')
  async withdrawalJob(job: Job<TransactionConsumerDto>) {
    const { data } = job;
    const typeTransaction = TypeTransaction.withdrawal;

    try {
      if (data.value < 0)
        throw new Error('Valor informado não pode ser negativo.');

      await this.findDuplicateTransaction(data?.codeTransaction).catch(
        (err) => {
          throw new Error(`Erro ao criar transação no banco - 01${err}`);
        },
      );

      const wallet = await this.walletRepository
        .getOne({ idAccount: data?.idAccount })
        .catch((err) => {
          throw new Error(`Erro ao criar transação no banco - ${err}`);
        });

      const validateWallet = walletTransactionCalculation(
        data?.value,
        typeTransaction,
        { idAccount: data?.idAccount, value: wallet?.value },
      );

      if (validateWallet?.type === 'error')
        throw new Error('Saldo insuficiente!');

      await this.transactionRepository
        .save({
          idAccount: data.idAccount,
          value: data.value,
          codeTransaction: data.codeTransaction,
          description: data.description,
          typeTransaction,
        })
        .catch((err) => {
          throw new Error(`Erro ao criar transação no banco - ${err}`);
        });

      await this.walletRepository
        .update(validateWallet?.idAccount, { value: validateWallet?.newValue })
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
      })
      .catch((err) => {
        throw new Error(`Erro ao consutar transação no banco - 02${err}`);
      });
  }
}
