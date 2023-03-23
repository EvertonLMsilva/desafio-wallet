import { Injectable, Inject } from '@nestjs/common';
import { BalanceDto } from '../dto/BalanceDto';
import { BalanceRepository } from '../repository/BalanceRepository';
import { ReturnBalanceType } from '../types/ReturnBalanceType';

@Injectable()
export class BalanceService {
  constructor(
    @Inject('walletInterface')
    private balanceRepository: BalanceRepository,
  ) { }

  async findBankStatement(
    balanceParams: BalanceDto,
  ): Promise<ReturnBalanceType> {

    const findWallet = await this.balanceRepository.getOne({
      idAccount: Number(balanceParams?.idAccount),
    }).then(resolve => {
      return { value: resolve?.value }
    })

    if (!findWallet)
      throw new Error('Não a carteira para este usuário!');


    return findWallet;
  }
}
