import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseDto } from 'src/infra/Dto/PurchaseDto';
import { PurchaseProducer } from '../domain/jobs/PurchaseProducer';
import { ApiTags } from '@nestjs/swagger';
import { ReturnMessageType } from 'src/infra/types/ReturnMessageType';
@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseApplication {
  constructor(private purchaseProducer: PurchaseProducer) {}

  @Post()
  createPurchase(
    @Body() purchaseDto: PurchaseDto,
  ): Promise<ReturnMessageType> {
    const createPurchase = this.purchaseProducer.createPurchase(purchaseDto);
    return createPurchase;
  }
}
