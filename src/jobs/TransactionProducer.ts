import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { randomUUID } from "crypto";
import { ReturnTransactionType } from "src/types/ReturnTransactionType";
import { TransactionDto } from "../Dto/TransactionDto";

@Injectable()
export class TransactionProducer {
    constructor(@InjectQueue('transactionDeposit-queue') private queue: Queue) {
    }

    async depositProducer(depositTransactionDto: TransactionDto): Promise<ReturnTransactionType> {
        try {
            if (depositTransactionDto.value < 0) throw new Error("Valor informado não pode ser negativo.");
            
            const codeTransaction = randomUUID();
            await this.queue.add("depositTransaction-job", { ...depositTransactionDto, codeTransaction });
            
            return { message: "Deposito em andamento!" }
        } catch (error) {
            return { message: error?.message }
        }
    }
}