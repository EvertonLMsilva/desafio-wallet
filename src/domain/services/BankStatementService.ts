import { Inject, Injectable } from '@nestjs/common/decorators';
import { DateStatementDto } from '../dto/DateStatementDto';
import TransactionEntity from '../entity/TransactionEntity';
import { BankStatementRepository } from '../repository/BankStatementRepository';
import { WalletRepository } from '../repository/WalletRepository';
import { ReturnBankStatementType } from '../types/ReturnBankStatementType';

@Injectable()
export class BankStatementService {
  constructor(
    @Inject('walletInterface')
    private walletRepository: WalletRepository,
    @Inject('BankStatementInterface')
    private bankStatementRepository: BankStatementRepository,
  ) {}

  async findBankStatement(
    dates: DateStatementDto,
  ): Promise<ReturnBankStatementType> {
    const statement: TransactionEntity[] =
      await this.bankStatementRepository.findStatement({
        initialDate: dates.initialDate,
        finalDate: dates.finalDate,
        idAccount: dates.idAccount,
      });

    const walletValue = await this.walletRepository.getOne({
      idAccount: Number(dates?.idAccount),
    });

    const resolve = {
      totalWallet: walletValue?.value,
      idAccount: walletValue?.idAccount,
      transactions: statement?.length > 0 ? statement : 'Conta sem registro!',
    };

    return resolve;
  }
}
