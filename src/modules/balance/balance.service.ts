import { Injectable } from '@nestjs/common';
import { BalanceRepository } from './balance.repository';

@Injectable()
export class BalanceService {
  constructor(private readonly repository: BalanceRepository) {}

  async getBalance(employeeId: string, locationId: string) {
    return this.repository.findByEmployeeAndLocation(employeeId, locationId);
  }

  async syncBalance(employeeId: string, locationId: string, availableDays: number) {
    return this.repository.syncBalance(employeeId, locationId, availableDays);
  }
}
