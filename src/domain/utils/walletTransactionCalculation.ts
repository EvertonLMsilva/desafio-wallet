import { TypeTransaction } from "src/enum/TypeTransaction"
import { WalletModel } from "src/infra/database/model/WalletModel"
import { ReturnGetWallet } from "src/types/ReturnGetWallet"

type Wallet = {
    id: number;
    value: number;
}

export const walletTransactionCalculation = (newValue: number, typeTransaction: TypeTransaction, wallet: Wallet): ReturnGetWallet => {

    if (typeTransaction === 'withdrawal' && (wallet.value - newValue) >= 0) {
        return {
            HasBalance: wallet?.value - newValue,
            idWallet: wallet?.id,
            type: 'withdrawal'
        }
    } else if (typeTransaction === 'deposit') {
        return {
            HasBalance: wallet?.value + newValue,
            idWallet: wallet?.id,
            type: 'deposit'
        }
    } else {
        return {
            HasBalance: 0,
            idWallet: wallet?.id,
            type: 'error'
        }
    }
}