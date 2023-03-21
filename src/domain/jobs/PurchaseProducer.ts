import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { PurchaseInterface } from 'src/domain/repository/PurchaseInterface';
import { PurchaseDto } from 'src/Dto/PurchaseDto';

@Injectable()
export class PurchaseRepository implements PurchaseInterface {
    constructor(
        @InjectQueue('transactionPurchase-queue') private queue: Queue,
    ) { }

    async createPurchase(purchaseDto: PurchaseDto): Promise<any> {
        try {
            const codeTransaction = randomUUID();
            await this.queue.add("purchaseTransaction-job", { ...purchaseDto, codeTransaction });

            return 'Compra em analise!';
        } catch (error) {
            return { message: error?.message }
        }
    }
}
