import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DateStatementDto } from '../Dto/DateStatementDto';
import { BankStatementRepository } from '../infra/repository/BankStatementRepository';
import { ReturnBankStatementType } from '../types/ReturnBankStatementType';

@ApiTags('Statements')
@Controller('statements')
export class BankStatementApplication {

    constructor(private bankStatementRepository: BankStatementRepository) {
    }

    @Get('/')
    async getStatement(@Query() dateStatement: DateStatementDto): Promise<ReturnBankStatementType> {
        const newStatement = await this.bankStatementRepository.findStatement(dateStatement);
        return newStatement;
    }

}
