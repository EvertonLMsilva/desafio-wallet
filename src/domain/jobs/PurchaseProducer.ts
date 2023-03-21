import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { PurchaseDto } from 'src/Dto/PurchaseDto';

type ReturnPurchaseType = {
    message: string;
};

@Injectable()
export class PurchaseProducer {
    constructor(
        @InjectQueue('transactionPurchase-queue') private queue: Queue,
    ) { }

    async createPurchase(purchaseDto: PurchaseDto): Promise<ReturnPurchaseType> {
        try {
            const codeTransaction = randomUUID();
            await this.queue.add("purchaseTransaction-job", { ...purchaseDto, codeTransaction });

            return { message: 'Compra em analise!' };
        } catch (error) {
            return { message: error?.message }
        }
    }
}
