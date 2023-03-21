import { Body, Controller, Post } from '@nestjs/common';
import { ReturnTransactionType } from 'src/types/ReturnTransactionType';
import { PurchaseDto } from 'src/Dto/PurchaseDto';
import { PurchaseRepository } from 'src/domain/jobs/PurchaseProducer';

@Controller('purchase')
export class PurchaseApplication {

    constructor(private purchaseRepository: PurchaseRepository) {
    }

    @Post()
    createPurchase(@Body() purchaseDto: PurchaseDto): Promise<ReturnTransactionType> {         
        const createPurchase = this.purchaseRepository.createPurchase(purchaseDto);
        return createPurchase;
    }

}
