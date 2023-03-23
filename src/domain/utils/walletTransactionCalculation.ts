import { TypeTransaction } from 'src/enum/TypeTransaction';
import { ReturnGetWallet } from 'src/infra/types/ReturnGetWallet';

type Wallet = {
  idAccount: number;
  value: number;
};

export const walletTransactionCalculation = (
  newValue: number,
  typeTransaction: TypeTransaction,
  wallet: Wallet,
): ReturnGetWallet => {
  if (
    (typeTransaction === 'withdrawal' || typeTransaction === 'purchase') &&
    wallet.value - newValue >= 0
  ) {
    return {
      newValue: Number(wallet?.value) - newValue,
      idAccount: wallet?.idAccount,
      type: 'withdrawal',
    };
  } else if (typeTransaction === 'deposit') {
    return {
      newValue: Number(wallet?.value) + newValue,
      idAccount: wallet?.idAccount,
      type: 'deposit',
    };
  } else {
    return {
      newValue: 0,
      idAccount: wallet?.idAccount,
      type: 'error',
    };
  }
};
