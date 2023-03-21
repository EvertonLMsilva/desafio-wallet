import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DateStatementDto } from 'src/Dto/DateStatementDto';
import { BankStatementRepository } from 'src/infra/repository/BankStatementRepository';

@ApiTags('Statements')
@Controller('statements')
export class BankStatementApplication {

    constructor(private bankStatementRepository: BankStatementRepository) {
    }

    @Get('/')
    async getStatement(@Query() dateStatement: DateStatementDto): Promise<any> {
        const newStatement = await this.bankStatementRepository.findStatement(dateStatement);
        return newStatement;
    }


}
