import { Body, Controller, Post } from '@nestjs/common';
import { TransactionDepositDto } from '../Dto/TransactionDepositDto';
import { TransactionProducer } from '../domain/jobs/TransactionProducer';
import { ReturnTransactionType } from '../types/ReturnTransactionType';
import { ApiTags } from '@nestjs/swagger';
import { TransactionWithdrawalDto } from 'src/Dto/TransactionWithdrawalDto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionApplication {

    constructor(private transactionProducer: TransactionProducer) {
    }

    @Post('/deposit')
    depositTransaction(@Body() depositTransactionDto: TransactionDepositDto): Promise<ReturnTransactionType> {        
        const createTransaction = this.transactionProducer.depositProducer(depositTransactionDto);
        return createTransaction;
    }

    @Post('/withdrawal')
    withdrawalTransaction(@Body() withdrawalTransactionDto: TransactionWithdrawalDto): Promise<ReturnTransactionType> {
        const createTransaction = this.transactionProducer.withdrawalProducer(withdrawalTransactionDto);
        return createTransaction;
    }

}
