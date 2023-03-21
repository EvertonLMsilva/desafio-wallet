import { Body, Controller, Post } from '@nestjs/common';
import { TransactionDto } from 'src/Dto/TransactionDto';
import { TransactionProducer } from '../domain/jobs/TransactionProducer';
import { ReturnTransactionType } from 'src/types/ReturnTransactionType';

@Controller('transaction')
export class TransactionApplication {

    constructor(private transactionProducer: TransactionProducer) {
    }

    @Post('/deposit')
    depositTransaction(@Body() depositTransactionDto: TransactionDto): Promise<ReturnTransactionType> {        
        const createTransaction = this.transactionProducer.depositProducer(depositTransactionDto);
        return createTransaction;
    }

    @Post('/withdrawal')
    withdrawalTransaction(@Body() withdrawalTransactionDto: TransactionDto): Promise<ReturnTransactionType> {
        const createTransaction = this.transactionProducer.withdrawalProducer(withdrawalTransactionDto);
        return createTransaction;
    }

}
