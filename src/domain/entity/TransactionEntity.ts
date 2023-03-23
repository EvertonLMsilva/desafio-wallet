export default class TransactionEntity {
  constructor(
    readonly idAccount: number,
    readonly value: number,
    readonly typeTransaction: string,
    readonly codeTransaction: string,
    readonly description: string,
    readonly active: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
