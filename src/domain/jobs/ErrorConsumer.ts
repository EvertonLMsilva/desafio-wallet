import { Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common/decorators";
import { Job } from "bull";
import { ErrorCreateTransactionDto } from "src/Dto/ErrorOnCreateTransactionDto";

@Injectable()
@Processor("errorTransaction-queue")
export class ErrorConsumer {
    constructor() { }

    @Process("errorInTransaction-job")
    async errorJob(job: Job<ErrorCreateTransactionDto>) {
        const { data } = job;
        console.log('--------- job consumer error', data);
    }

}