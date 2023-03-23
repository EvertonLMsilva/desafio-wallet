import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { TransactionDepositDto } from 'src/infra/Dto/TransactionDepositDto';
import { TransactionProducer } from '../domain/jobs/TransactionProducer';
import { TransactionWithdrawalDto } from 'src/infra/Dto/TransactionWithdrawalDto';
import { ReturnMessageType } from 'src/infra/types/ReturnMessageType';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionApplication {
  constructor(private transactionProducer: TransactionProducer) {}

  @Post('/deposit')
  depositTransaction(
    @Body() depositTransactionDto: TransactionDepositDto,
  ): Promise<ReturnMessageType> {
    const createTransaction = this.transactionProducer.depositProducer(
      depositTransactionDto,
    );
    return createTransaction;
  }

  @Post('/withdrawal')
  withdrawalTransaction(
    @Body() withdrawalTransactionDto: TransactionWithdrawalDto,
  ): Promise<ReturnMessageType> {
    const createTransaction = this.transactionProducer.withdrawalProducer(
      withdrawalTransactionDto,
    );
    return createTransaction;
  }
}
