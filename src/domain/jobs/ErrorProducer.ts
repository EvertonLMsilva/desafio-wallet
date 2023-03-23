import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ErrorCreateTransactionDto } from 'src/infra/Dto/ErrorOnCreateTransactionDto';

@Injectable()
export class ErrorProducer {
  constructor(@InjectQueue('errorTransaction-queue') private queue: Queue) {}

  async ErrorInJob(errorOnCreateTransactionDto: ErrorCreateTransactionDto) {
    await this.queue.add('errorInTransaction-job', errorOnCreateTransactionDto);
  }
}
