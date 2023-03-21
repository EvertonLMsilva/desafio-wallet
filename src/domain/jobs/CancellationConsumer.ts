import { Process, Processor } from "@nestjs/bull";
import { CancellationDto } from "src/Dto/CancellationDto";
import { Inject, Injectable } from "@nestjs/common/decorators";
import { Job } from "bull";
import { TransactionModel } from "src/infra/database/model/TransactionModel";
import { ErrorProducer } from "./ErrorProducer";
import { TypeTransaction } from "src/enum/TypeTransaction";

@Injectable()
@Processor("cancellation-queue")
export class CancellationConsumer {
    constructor(
        @Inject('transaction') private transactionRepository: typeof TransactionModel,
        private errorProducer: ErrorProducer,
    ) { }

    @Process("cancellation-job")
    async cancellationJob(job: Job<CancellationDto>) {
        const { data } = job;
        const typeTransaction = TypeTransaction.cancellation;

        try {
            const transaction = await this.transactionRepository.findOne({
                where: {
                    idAccount: data?.idAccount,
                    codeTransaction: data?.codeTransaction,
                    typeTransaction: 'purchase'
                }
            })

            if (!transaction?.dataValues)
                throw new Error('Não é posivel efetuar o cancelamento - Id usuário ou codigo da transação é inválido.');

            if (transaction?.dataValues?.typeTransaction !== 'purchase')
                throw new Error('Não é posivel efetuar o cancelamento - Tipo de transação não pode ser cancelada.');

            const Duplicate = await this.transactionRepository.findOne({
                where: {
                    idAccount: data?.idAccount,
                    codeTransaction: data?.codeTransaction,
                    active: false
                }
            })

            if(Duplicate?.dataValues) throw new Error('Transação já cancelada!')
            
            await this.transactionRepository.update(
                { active: false },
                {
                    where: {
                        idAccount: data?.idAccount,
                        codeTransaction: data?.codeTransaction,

                    }
                }
            )

            await this.transactionRepository.create<TransactionModel>({
                idAccount: data?.idAccount,
                value: transaction?.dataValues?.value,
                codeTransaction: data?.codeTransaction,
                typeTransaction,
                description: data?.description
            })
                .catch(err => {
                    throw new Error(`Erro ao criar transação no banco - ${err}`);
                })

        } catch (error) {
            await this.errorProducer.ErrorInJob({
                codeTransaction: data?.codeTransaction,
                description: {
                    module: 'transaction',
                    specification: typeTransaction,
                    message: error.message
                },
            });
        }


    }

}