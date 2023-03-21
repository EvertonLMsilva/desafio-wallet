import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { randomUUID } from "crypto";
import { ReturnTransactionType } from "../../types/ReturnTransactionType";
import { TransactionApplicationDto } from "../../Dto/TransactionApplicationDto";

@Injectable()
export class TransactionProducer {
    constructor(@InjectQueue('transactionDeposit-queue') private queue: Queue) {
    }

    async depositProducer(depositTransactionDto: TransactionApplicationDto): Promise<ReturnTransactionType> {
        try {
            if (depositTransactionDto.value < 0) throw new Error("Valor informado não pode ser negativo.");
            
            const codeTransaction = randomUUID();
            await this.queue.add("depositTransaction-job", { ...depositTransactionDto, codeTransaction });
            
            return { message: "Deposito efetuado!" }
        } catch (error) {
            return { message: error?.message }
        }
    }

    async withdrawalProducer(withdrawalTransactionDto: TransactionApplicationDto): Promise<ReturnTransactionType> {
        const codeTransaction = randomUUID();
        await this.queue.add("withdrawalTransaction-job", { ...withdrawalTransactionDto, codeTransaction });

        return { message: "Saque efetuado!" }
    }
}