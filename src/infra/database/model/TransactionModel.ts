import { Column, DataType, Model, Table } from "sequelize-typescript";
import { TransactionEntity } from "../../../domain/entity/TransactionEntity";

@Table({ modelName: 'transaction' })
export class TransactionModel extends Model<TransactionEntity> {
    @Column
    idAccount: number;

    @Column({type: DataType.DECIMAL(9)})
    value: number;

    @Column
    typeTransaction: string;

    @Column
    codeTransaction: string;

    @Column
    createdAt: Date
    
    @Column
    updatedAt: Date

}