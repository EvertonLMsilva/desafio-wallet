import { Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common/decorators";
import { Job } from "bull";
import { ErrorCreateTransactionDto } from "src/Dto/ErrorOnCreateTransactionDto";

@Injectable()
@Processor("errorTransactionDeposit-queue")
export class ErrorTransactionConsumer {
    constructor() { }

    @Process("errorInTransaction-job")
    async depositJob(job: Job<ErrorCreateTransactionDto>) {
        const { data } = job;
        console.log('--------- job consumer error transaction', data);
    }

}