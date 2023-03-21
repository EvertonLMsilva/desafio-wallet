import { Process, Processor } from "@nestjs/bull";
import { Inject, Injectable } from "@nestjs/common/decorators";
import { Job } from "bull";
import { ReturnGetWallet } from "../../types/ReturnGetWallet";
import { TransactionDto } from "../../Dto/TransactionDto";
import { TransactionModel } from "../../infra/database/model/TransactionModel";
import { WalletModel } from "../../infra/database/model/WalletModel";
import { TypeTransaction } from "../../enum/TypeTransaction";
import { ErrorTransactionProducer } from "./ErrorTransactionProducer";

@Injectable()
@Processor("transactionDeposit-queue")
export class TransactionConsumer {
    constructor(
        @Inject('transaction') private transactionRepository: typeof TransactionModel,
        @Inject('wallet') private walletRepository: typeof WalletModel,
        private errorTransactionProducer: ErrorTransactionProducer
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
            await this.errorTransactionProducer.ErrorOnCreateUser({
                codeTransaction: data?.codeTransaction,
                description: {
                    module: 'transaction',
                    specification: typeTransaction,
                    message: error.message
                },
            });
        }
    }

    @Process("withdrawalTransaction-job")
    async withdrawalJob(job: Job<TransactionDto>) {
        const { data } = job;
        const typeTransaction = TypeTransaction.withdrawal

        try {
            if (data.value < 0) throw new Error("Valor informado não pode ser negativo.");

            await this.findDuplicateTransaction(data?.codeTransaction);

            const validateWallet = await this.walletTransactionCalculation(data?.idAccount, data?.value, typeTransaction);

            if (validateWallet?.type === 'error') throw new Error("Saldo insuficiente!");

            await this.transactionRepository.create<TransactionModel>({ ...data, typeTransaction })
                .catch(err => {
                    throw new Error(`Erro ao criar transação no banco - ${err}`);
                })

            await this.walletRepository.update<WalletModel>(
                { value: validateWallet.HasBalance },
                { where: { id: Number(validateWallet?.idWallet), } }
            )
                .catch(err => {
                    throw new Error(`Erro ao atualizar carteira de usuário - ${err}`);
                })

        } catch (error) {
            await this.errorTransactionProducer.ErrorOnCreateUser({
                codeTransaction: data?.codeTransaction,
                description: {
                    module: 'transaction',
                    specification: typeTransaction,
                    message: error.message
                },
            });
        }
    }

    private async walletTransactionCalculation(idAccount: number, newValue: number, typeTransaction: TypeTransaction): Promise<ReturnGetWallet> {
        return await this.walletRepository.findOne({ where: { idAccount } })
            .then(res => {
                const walletValue = Number(res?.dataValues?.value)

                if (typeTransaction === 'withdrawal' && (walletValue - newValue) >= 0) {
                    return {
                        HasBalance: walletValue - newValue,
                        idWallet: res?.id,
                        type: 'withdrawal'
                    }
                } else if (typeTransaction === 'deposit') {
                    return {
                        HasBalance: walletValue + newValue,
                        idWallet: res?.id,
                        type: 'deposit'
                    }
                }else {
                    return {
                        HasBalance: 0,
                        idWallet: res?.id,
                        type: 'error'
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