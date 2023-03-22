import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancellationProducer } from '../domain/jobs/CancellationProducer';
import { CancellationDto } from '../Dto/CancellationDto';
import { ReturnCancellationType } from '../types/ReturnCancellationType';

@ApiTags('Cancellation')
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
