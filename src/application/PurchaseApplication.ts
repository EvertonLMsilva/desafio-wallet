import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseDto } from '../Dto/PurchaseDto';
import { PurchaseProducer } from '../domain/jobs/PurchaseProducer';
import { ApiTags } from '@nestjs/swagger';
import { ReturnPurchaseType } from '../types/ReturnPurchaseType';
@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseApplication {

    constructor(private purchaseProducer: PurchaseProducer) {
    }

    @Post()
    createPurchase(@Body() purchaseDto: PurchaseDto): Promise<ReturnPurchaseType> {         
        const createPurchase = this.purchaseProducer.createPurchase(purchaseDto);
        return createPurchase;
    }

}
