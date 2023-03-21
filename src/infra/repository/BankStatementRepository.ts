import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { BankStatementInterface } from 'src/domain/repository/BankStatementInterface';
import { DateStatementDto } from 'src/Dto/DateStatementDto';
import { TransactionModel } from '../database/model/TransactionModel';

@Injectable()
export class BankStatementRepository implements BankStatementInterface {
    constructor(@Inject('transaction') private transactionRepository: typeof TransactionModel) {
    }

    async findStatement(dateStatement: DateStatementDto): Promise<any> {        
        const statement = await this.transactionRepository.findAll({
            attributes: ['typeTransaction', 'codeTransaction', 'value'],
            where: {
                idAccount: dateStatement?.idAccount,
                [Op.and]: [
                    { createdAt: { [Op.gte]: `${dateStatement?.initialDate} 00:00:01` } },
                    { createdAt: { [Op.lte]: `${dateStatement?.finalDate} 23:59:59` } },
                ]
            },
        });

        return statement;
    }
}
