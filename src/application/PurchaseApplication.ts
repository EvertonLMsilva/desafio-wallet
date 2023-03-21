import { Body, Controller, Post } from '@nestjs/common';
import { ReturnTransactionType } from 'src/types/ReturnTransactionType';
import { PurchaseDto } from 'src/Dto/PurchaseDto';
import { PurchaseProducer } from 'src/domain/jobs/PurchaseProducer';

@Controller('purchase')
export class PurchaseApplication {

    constructor(private purchaseProducer: PurchaseProducer) {
    }

    @Post()
    createPurchase(@Body() purchaseDto: PurchaseDto): Promise<ReturnTransactionType> {         
        const createPurchase = this.purchaseProducer.createPurchase(purchaseDto);
        return createPurchase;
    }

}
