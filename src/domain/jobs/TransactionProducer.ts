import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { randomUUID } from "crypto";
import { ReturnTransactionType } from "../../types/ReturnTransactionType";
import { TransactionDepositDto } from "../../Dto/TransactionDepositDto";
import { TransactionWithdrawalDto } from "src/Dto/TransactionWithdrawalDto";

@Injectable()
export class TransactionProducer {
    constructor(@InjectQueue('transactionDeposit-queue') private queue: Queue) {
    }

    async depositProducer(depositTransactionDto: TransactionDepositDto): Promise<ReturnTransactionType> {
        try {
            if (depositTransactionDto.value < 0) throw new Error("Valor informado não pode ser negativo.");
            
            const codeTransaction = randomUUID();
            await this.queue.add("depositTransaction-job", { ...depositTransactionDto, codeTransaction });
            
            return { message: "Deposito efetuado!" }
        } catch (error) {
            return { message: error?.message }
        }
    }

    async withdrawalProducer(withdrawalTransactionDto: TransactionWithdrawalDto): Promise<ReturnTransactionType> {
        const codeTransaction = randomUUID();
        await this.queue.add("withdrawalTransaction-job", { ...withdrawalTransactionDto, codeTransaction });

        return { message: "Saque efetuado!" }
    }
}