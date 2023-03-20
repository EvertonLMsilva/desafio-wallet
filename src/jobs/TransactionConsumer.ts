import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Inject, Injectable } from "@nestjs/common/decorators";
import { Job, Queue } from "bull";
import { ReturnGetWallet } from "../types/ReturnGetWallet";
import { TransactionDto } from "../Dto/TransactionDto";
import { TransactionModel } from "../infra/database/model/TransactionModel";
import { WalletModel } from "../infra/database/model/WalletModel";
import { TypeTransaction } from "../enum/TypeTransaction";

@Injectable()
@Processor("transactionDeposit-queue")
export class TransactionConsumer {
    constructor(
        @Inject('transaction') private transactionRepository: typeof TransactionModel,
        @Inject('wallet') private walletRepository: typeof WalletModel
    ) { }

    @Process("depositTransaction-job")
    async depositJob(job: Job<TransactionDto>) {
        const { data } = job;
        const typeTransaction = TypeTransaction.deposit;

        try {
            if (data.value < 0) throw new Error("Valor informado não pode ser negativo.");

            await this.findDuplicateTransaction(data?.codeTransaction);

            const validateWallet = await this.walletTransactionCalculation(data?.idAccount, data?.value, typeTransaction);

            await this.transactionRepository.create<TransactionModel>({ ...data, typeTransaction })
                .catch(err => {
                    throw new Error(`Erro ao criar transação no banco - ${err}`);
                })

            await this.walletRepository.update<WalletModel>(
                { value: validateWallet.HasBalance },
                { where: { id: validateWallet?.idWallet } }
            )
                .catch(err => {
                    throw new Error(`Erro ao atualizar carteira de usuário - ${err}`);
                });

        } catch (error) {
            throw new Error('Erro ao cadastrar usuario.')
        }
    }

    private async walletTransactionCalculation(idAccount: number, newValue: number, typeTransaction: TypeTransaction): Promise<ReturnGetWallet> {
        return await this.walletRepository.findOne({ where: { idAccount } })
            .then(res => {
                if (typeTransaction === 'deposit') {
                    return {
                        HasBalance: Number(res?.dataValues?.value) + newValue,
                        idWallet: res?.id,
                        type: 'deposit'
                    }
                }

            })
    }

    private async findDuplicateTransaction(codeTransaction: string): Promise<void> {
        await this.transactionRepository.findOne({
            where: { codeTransaction }
        }).then((resolve) => {
            if (resolve) throw new Error("Transação já realizada.");
        })
    }
}