import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { ErrorCreateTransactionDto } from "src/Dto/ErrorOnCreateTransactionDto";


@Injectable()
export class ErrorTransactionProducer {
    constructor(@InjectQueue('errorTransactionDeposit-queue') private queue: Queue) {
    }

    async ErrorOnCreateUser(errorOnCreateTransactionDto: ErrorCreateTransactionDto) {
        await this.queue.add("errorInTransaction-job", errorOnCreateTransactionDto)
    }
}