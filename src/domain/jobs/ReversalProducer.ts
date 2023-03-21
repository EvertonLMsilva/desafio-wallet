import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ReversalDto } from 'src/Dto/ReversalDto';
import { TypeTransaction } from 'src/enum/TypeTransaction';
import { ErrorProducer } from './ErrorProducer';

@Injectable()
export class ReversalProducer {
    constructor(
        @InjectQueue('reversal-queue') private queue: Queue,
        private errorProducer: ErrorProducer
    ) { }

    async createReversal(reversalDto: ReversalDto): Promise<void> {
        const typeTransaction = TypeTransaction.error

        await this.queue.add("reversal-job", reversalDto)
            .catch(async () => {
                await this.errorProducer.ErrorInJob({
                    codeTransaction: null,
                    description: {
                        module: 'transaction',
                        specification: typeTransaction,
                        message: 'Erro no cadastrar de estorno a fila.'
                    },
                });
            })
    }
}
