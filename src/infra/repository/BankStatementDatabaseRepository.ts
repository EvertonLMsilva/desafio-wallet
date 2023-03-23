import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { DateStatementDto } from 'src/domain/dto/DateStatementDto';
import TransactionEntity from 'src/domain/entity/TransactionEntity';
import { BankStatementRepository } from 'src/domain/repository/BankStatementRepository';
import { TransactionModel } from '../database/model/TransactionModel';
import { WalletModel } from '../database/model/WalletModel';

@Injectable()
export class BankStatementDatabaseRepository
  implements BankStatementRepository
{
  constructor(
    @Inject('transaction')
    private transactionRepository: typeof TransactionModel,
  ) {}

  async findStatement(
    dateStatement: DateStatementDto,
  ): Promise<TransactionEntity[]> {
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

    return statement;
  }
}
