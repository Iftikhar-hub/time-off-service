import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from '../../src/modules/balance/balance.service';
import { BalanceRepository } from '../../src/modules/balance/balance.repository';

describe('BalanceService', () => {
  let service: BalanceService;
  let repository: Partial<BalanceRepository>;

  beforeEach(async () => {
    repository = {
      findByEmployeeAndLocation: jest.fn().mockResolvedValue({ employeeId: '100', locationId: 'NYC', availableDays: 12 }),
      syncBalance: jest.fn().mockResolvedValue({ employeeId: '100', locationId: 'NYC', availableDays: 14 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        { provide: BalanceRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it('should return current balance for employee and location', async () => {
    const balance = await service.getBalance('100', 'NYC');
    expect(repository.findByEmployeeAndLocation).toHaveBeenCalledWith('100', 'NYC');
    expect(balance.availableDays).toBe(12);
  });
});
