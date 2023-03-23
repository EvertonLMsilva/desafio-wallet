import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankStatementService } from 'src/domain/services/BankStatementService';
import { ReturnBankStatementType } from 'src/domain/types/ReturnBankStatementType';
import { DateStatementDto } from 'src/infra/Dto/DateStatementDto';

@ApiTags('Bank Statement')
@Controller('bankStatement')
export class BankStatementApplication {
  constructor(private bankStatementService: BankStatementService) {}

  @Get('/')
  async getStatement(
    @Query() dateStatement: DateStatementDto,
  ): Promise<ReturnBankStatementType> {
    const newStatement = await this.bankStatementService.findBankStatement(
      dateStatement,
    );

    return newStatement;
  }
}
