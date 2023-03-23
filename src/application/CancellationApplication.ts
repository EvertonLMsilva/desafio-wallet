import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancellationProducer } from '../domain/jobs/CancellationProducer';
import { CancellationDto } from 'src/infra/Dto/CancellationDto';
import { ReturnMessageType } from 'src/infra/types/ReturnMessageType';

@ApiTags('Cancellation')
@Controller('cancellation')
export class CancellationApplication {
  constructor(private cancellationProducer: CancellationProducer) {}

  @Post()
  createCancellation(
    @Body() cancellationDto: CancellationDto,
  ): Promise<ReturnMessageType> {
    const createCancellation =
      this.cancellationProducer.createCancellation(cancellationDto);
    return createCancellation;
  }
}
