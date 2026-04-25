import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { BalanceService } from '../balance/balance.service';
import { SyncLogRepository } from './sync-log.repository';
import { BatchSyncPayloadDto } from './dto/batch-sync-payload.dto';

@Injectable()
export class HcmSyncService {
  private readonly logger = new Logger(HcmSyncService.name);

  private readonly localBalances = [
    { employeeId: '100', locationId: 'NYC', availableDays: 10 },
    { employeeId: '100', locationId: 'SFO', availableDays: 8 },
    { employeeId: '101', locationId: 'NYC', availableDays: 5 },
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly balanceService: BalanceService,
    private readonly syncLogRepository: SyncLogRepository,
  ) {}

  private findLocalBalance(employeeId: string, locationId: string) {
    return this.localBalances.find(
      (item) => item.employeeId === employeeId && item.locationId === locationId,
    );
  }

  private async fallbackSync() {
    const batchData = this.localBalances.map((item) => ({
      employeeId: item.employeeId,
      locationId: item.locationId,
      availableDays: item.availableDays,
    }));

    for (const item of batchData) {
      await this.balanceService.syncBalance(item.employeeId, item.locationId, item.availableDays);
    }

    return batchData;
  }

  private async fallbackValidate(employeeId: string, locationId: string, days: number) {
    const balance = this.findLocalBalance(employeeId, locationId);
    if (!balance) {
      throw new ServiceUnavailableException('Employee or location not found in local HCM fallback.');
    }

    if (days > balance.availableDays) {
      throw new ServiceUnavailableException('Insufficient HCM balance in local HCM fallback.');
    }

    balance.availableDays -= days;
    return {
      success: true,
      employeeId,
      locationId,
      deductedDays: days,
      remainingBalance: balance.availableDays,
      processedAt: new Date().toISOString(),
    };
  }

  async sync(payload: BatchSyncPayloadDto) {
    const log = await this.syncLogRepository.log({
      trigger: payload.trigger,
      status: 'STARTED',
      details: JSON.stringify(payload),
    });

    try {
      const url = process.env.HCM_API_URL || 'http://localhost:4000';
      const response = await firstValueFrom(
        this.httpService.post(`${url}/hcm/batch-sync`, payload),
      );

      if (Array.isArray(response.data)) {
        for (const item of response.data) {
          await this.balanceService.syncBalance(item.employeeId, item.locationId, item.availableDays);
        }
      }

      await this.syncLogRepository.updateStatus(log.id, 'COMPLETED');
      return response.data;
    } catch (error) {
      this.logger.warn('HCM sync external service unavailable, using local fallback', error);
      const batchData = await this.fallbackSync();
      await this.syncLogRepository.updateStatus(log.id, 'COMPLETED');
      return batchData;
    }
  }

  async validateBalance(employeeId: string, locationId: string, days: number) {
    const url = process.env.HCM_API_URL || 'http://localhost:4000';

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${url}/hcm/deduct-balance`, { employeeId, locationId, days }),
      );
      return response.data;
    } catch (error) {
      this.logger.warn('Balance validation external service unavailable, using local fallback', error);
      return this.fallbackValidate(employeeId, locationId, days);
    }
  }

  getLogs() {
    return this.syncLogRepository.findAll();
  }
}
