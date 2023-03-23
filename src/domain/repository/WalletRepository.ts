import { WalletDto } from '../dto/WalletDto';
import WalletEntity from '../entity/WalletEntity';

export interface WalletRepository {
  save(transactionEntity: WalletDto): Promise<void>;
  getAll(identificationValues: WalletDto): Promise<WalletEntity[]>;
  getOne(identificationValues: WalletDto): Promise<WalletEntity>;
  update(idAccount: number, WalletEntity: WalletEntity): Promise<void>;
}
