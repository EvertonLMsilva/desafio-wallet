import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BalanceService } from 'src/domain/services/BalanceService';
import { ReturnBalanceType } from 'src/domain/types/ReturnBalanceType';
import { BalanceDto } from 'src/infra/Dto/BalanceDto';

@ApiTags('Balance')
@Controller('balance')
export class BalanceApplication {
  constructor(private balanceRepository: BalanceService) { }

  @Get('/')
  async getBalance(
    @Query() balanceDto: BalanceDto,
  ): Promise<ReturnBalanceType> {
    const findBalance = await this.balanceRepository.findBankStatement(balanceDto);

    return findBalance;
  }
}
