import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BalanceDto } from 'src/Dto/BalanceDto';
import { BalanceRepository } from 'src/infra/repository/BalanceRepository';
import { ReturnBalanceType } from 'src/types/ReturnBalanceType';

@ApiTags('Balance')
@Controller('balance')
export class BalanceApplication {

    constructor(private balanceRepository: BalanceRepository) {
    }

    @Get('/')
    async getBalance(@Query() balanceDto: BalanceDto): Promise<ReturnBalanceType> {
        const newBalance = await this.balanceRepository.getBalance(balanceDto);
        return newBalance;
    }
}
