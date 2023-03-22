import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { DateStatementDto } from 'src/Dto/DateStatementDto';
import { TransactionModel } from '../database/model/TransactionModel';
import { WalletModel } from '../database/model/WalletModel';

@Injectable()
export class BankStatementRepository {
  constructor(
    @Inject('transaction')
    private transactionRepository: typeof TransactionModel,
    @Inject('wallet') private walletRepository: typeof WalletModel,
  ) {}

  async findStatement(dateStatement: DateStatementDto): Promise<any> {
    const statement = await this.transactionRepository.findAll({
      attributes: {
        exclude: ['id', 'updatedAt', 'idAccount', 'codeTransaction', 'active'],
      },
      where: {
        idAccount: dateStatement?.idAccount,
        [Op.and]: [
          { createdAt: { [Op.gte]: `${dateStatement?.initialDate} 00:00:01` } },
          { createdAt: { [Op.lte]: `${dateStatement?.finalDate} 23:59:59` } },
        ],
      },
    });

    const walletValue = await this.walletRepository.findOne({
      where: { idAccount: dateStatement?.idAccount },
    });

    const resolve = {
      totalWallet: walletValue?.dataValues?.value,
      account: dateStatement?.idAccount,
      transactions: statement?.length > 0 ? statement : 'Conta sem registro!',
    };

    return resolve;
  }
}
