import { Body, Controller, Post } from '@nestjs/common';
import { TransactionApplicationDto } from 'src/Dto/TransactionApplicationDto';
import { TransactionProducer } from '../domain/jobs/TransactionProducer';
import { ReturnTransactionType } from 'src/types/ReturnTransactionType';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {

    constructor(private transactionProducer: TransactionProducer) {
    }

    @Post('/deposit')
    depositTransaction(@Body() depositTransactionDto: TransactionApplicationDto): Promise<ReturnTransactionType> {        
        const createTransaction = this.transactionProducer.depositProducer(depositTransactionDto);
        return createTransaction;
    }

    @Post('/withdrawal')
    withdrawalTransaction(@Body() withdrawalTransactionDto: TransactionApplicationDto): Promise<ReturnTransactionType> {
        const createTransaction = this.transactionProducer.withdrawalProducer(withdrawalTransactionDto);
        return createTransaction;
    }

}
