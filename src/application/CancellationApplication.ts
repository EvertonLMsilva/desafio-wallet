import { Body, Controller, Post } from '@nestjs/common';
import { CancellationProducer } from 'src/domain/jobs/CancellationProducer';
import { CancellationDto } from 'src/Dto/CancellationDto';
import { ReturnCancellationType } from 'src/types/ReturnCancellationType';

@Controller('cancellation')
export class CancellationApplication {

    constructor(private cancellationProducer: CancellationProducer) {
    }

    @Post()
    createCancellation(@Body() cancellationDto: CancellationDto): Promise<ReturnCancellationType> {
        const createCancellation = this.cancellationProducer.createCancellation(cancellationDto);
        return createCancellation;
    }

}
