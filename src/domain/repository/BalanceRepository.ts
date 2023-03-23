import { BalanceDto } from '../dto/BalanceDto';
import WalletEntity from '../entity/WalletEntity';

export interface BalanceRepository {
  getOne(identificationValues: BalanceDto): Promise<WalletEntity>;
}
