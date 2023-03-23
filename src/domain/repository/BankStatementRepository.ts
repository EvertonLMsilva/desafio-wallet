import { BankStatementDto } from '../dto/BankStatementDto';
import TransactionEntity from '../entity/TransactionEntity';

export interface BankStatementRepository {
  findStatement(dateStatement: BankStatementDto): Promise<TransactionEntity[]>;
}
