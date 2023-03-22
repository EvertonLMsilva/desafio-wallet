import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { BalanceDto } from 'src/Dto/BalanceDto';
import { DateStatementDto } from 'src/Dto/DateStatementDto';
import { TransactionModel } from '../database/model/TransactionModel';
import { WalletModel } from '../database/model/WalletModel';

@Injectable()
export class BalanceRepository {
    constructor(
        @Inject('transaction') private transactionRepository: typeof TransactionModel,
        @Inject('wallet') private walletRepository: typeof WalletModel
    ) {
    }

    async getBalance(balanceDto: BalanceDto): Promise<any> {
        try {
            const findWallet = await this.walletRepository.findOne({
                attributes: ['value'],
                where: {
                    idAccount: balanceDto?.idAccount,
                },
            })

            if (!findWallet?.dataValues) throw new Error('Não a carteira para este usuário!')

            return findWallet?.dataValues;
        } catch (error) {
            return { message: error.message }
        }
    }
}
