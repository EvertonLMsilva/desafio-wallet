import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import TransactionEntity from 'src/domain/entity/TransactionEntity';
import { TransactionRepository } from 'src/domain/repository/TransactionRepository';
import { DateStatementDto } from '../Dto/DateStatementDto';
import { TransactionDto } from '../../domain/dto/TransactionDto';
import { TransactionModel } from '../database/model/TransactionModel';

@Injectable()
export class TransactionDatabaseRepository implements TransactionRepository {
  constructor(
    @Inject('transaction') private transactionModel: typeof TransactionModel,
  ) {}

  async save(transactionDto: TransactionDto): Promise<void> {
    await this.transactionModel.create(transactionDto);
  }

  async getAll(transactionDto: TransactionDto): Promise<TransactionEntity[]> {
    const findWallet = await this.transactionModel.findAll({
      attributes: ['value'],
      where: {
        idAccount: transactionDto?.idAccount,
      },
    });

    return findWallet;
  }

  async getOne(transactionDto: TransactionDto): Promise<TransactionEntity> {
    const findWallet = await this.transactionModel.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { ...transactionDto },
    });

    return findWallet?.dataValues;
  }

  async update(
    identify: TransactionDto,
    values: TransactionEntity,
  ): Promise<void> {
    await this.transactionModel.update(
      { ...values },
      {
        where: { ...identify },
      },
    );
  }

  async findStatement(dateStatement: DateStatementDto): Promise<any> {
    const statement = await this.transactionModel.findAll({
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
