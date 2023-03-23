import { TransactionDto } from '../dto/TransactionDto';
import TransactionEntity from '../entity/TransactionEntity';

export interface TransactionRepository {
  save(valuesToSave: TransactionDto): Promise<void>;
  getAll(identificationValues: TransactionDto): Promise<TransactionEntity[]>;
  getOne(identificationValues: TransactionDto): Promise<TransactionEntity>;
  update(identificationValues: TransactionDto, valuesToUpdate: TransactionDto): Promise<void>;
}
