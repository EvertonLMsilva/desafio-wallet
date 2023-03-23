import TransactionEntity from 'src/domain/entity/TransactionEntity';

export type ReturnBankStatementType = {
  totalWallet: number;
  idAccount: string;
  transactions: TransactionEntity[] | string;
};
