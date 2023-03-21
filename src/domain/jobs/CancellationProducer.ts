import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CancellationDto } from 'src/Dto/CancellationDto';

type ReturnCancellationType = {
    message: string;
};

@Injectable()
export class CancellationProducer {
    constructor(
        @InjectQueue('cancellation-queue') private queue: Queue,
    ) { }

    async createCancellation(cancellationDto: CancellationDto): Promise<ReturnCancellationType> {
        try {
            await this.queue.add("cancellation-job", cancellationDto);

            return { message: 'Cancelamento em analise!' };
        } catch (error) {
            return { message: error?.message }
        }
    }
}
