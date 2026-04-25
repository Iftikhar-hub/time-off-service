import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './entities/balance.entity';

@Injectable()
export class BalanceRepository {
  constructor(
    @InjectRepository(Balance)
    private readonly repository: Repository<Balance>,
  ) {}

  async findByEmployeeAndLocation(employeeId: string, locationId: string) {
    return (
      (await this.repository.findOne({ where: { employeeId, locationId } })) ||
      this.repository.create({ employeeId, locationId, availableDays: 0 })
    );
  }

  async save(balance: Balance) {
    return this.repository.save(balance);
  }

  async syncBalance(employeeId: string, locationId: string, availableDays: number) {
    const balance = await this.repository.findOne({ where: { employeeId, locationId } });
    if (balance) {
      balance.availableDays = availableDays;
      return this.repository.save(balance);
    }

    return this.repository.save(
      this.repository.create({ employeeId, locationId, availableDays }),
    );
  }
}
