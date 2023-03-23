import { Column, DataType, Model, Table } from 'sequelize-typescript';
import WalletEntity from '../../../domain/entity/WalletEntity';

@Table({ modelName: 'wallet' })
export class WalletModel extends Model<WalletEntity> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column
  idAccount: number;

  @Column({ type: DataType.DECIMAL(15) })
  value: number;
}
