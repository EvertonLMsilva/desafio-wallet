import { Test, TestingModule } from '@nestjs/testing';
import { BankStatementRepository } from './BankStatementRepository';

describe('BankStatementService', () => {
  let service: BankStatementRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankStatementRepository],
    }).compile();

    service = module.get<BankStatementRepository>(BankStatementRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
