import { Injectable, BadRequestException } from '@nestjs/common';
import { DeductBalanceDto } from './dto/deduct-balance.dto';

@Injectable()
export class HcmService {
  private balances = [
    { employeeId: '100', locationId: 'NYC', availableDays: 10 },
    { employeeId: '100', locationId: 'SFO', availableDays: 8 },
    { employeeId: '101', locationId: 'NYC', availableDays: 5 },
  ];

  deductBalance(dto: DeductBalanceDto) {
    const balance = this.balances.find(
      (item) => item.employeeId === dto.employeeId && item.locationId === dto.locationId,
    );

    if (!balance) {
      throw new BadRequestException('Employee or location not found');
    }

    if (dto.days > balance.availableDays) {
      throw new BadRequestException('Insufficient HCM balance');
    }

    balance.availableDays -= dto.days;
    return {
      success: true,
      employeeId: dto.employeeId,
      locationId: dto.locationId,
      deductedDays: dto.days,
      remainingBalance: balance.availableDays,
      processedAt: new Date().toISOString(),
    };
  }

  getBalance(employeeId: string, locationId: string) {
    const balance = this.balances.find(
      (item) => item.employeeId === employeeId && item.locationId === locationId,
    );
    if (!balance) {
      throw new BadRequestException('Employee or location not found');
    }
    return balance;
  }

  batchSync() {
    return this.balances;
  }
}
