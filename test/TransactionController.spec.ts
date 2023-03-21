import { Test, TestingModule } from '@nestjs/testing';
import { TransactionApplication } from '../src/application/TransactionApplication';

describe('TransactionController', () => {
  let controller: TransactionApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionApplication],
    }).compile();

    controller = module.get<TransactionApplication>(TransactionApplication);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
