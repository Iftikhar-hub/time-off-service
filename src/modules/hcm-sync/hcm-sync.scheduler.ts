import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HcmSyncService } from './hcm-sync.service';
import { BatchSyncPayloadDto } from './dto/batch-sync-payload.dto';
import { SyncTrigger } from '../../common/enums/sync-trigger.enum';

@Injectable()
export class HcmSyncScheduler {
  private readonly logger = new Logger(HcmSyncScheduler.name);

  constructor(private readonly hcmSyncService: HcmSyncService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleScheduledSync() {
    this.logger.log('Running scheduled HCM sync');
    const payload: BatchSyncPayloadDto = {
      trigger: SyncTrigger.SCHEDULED,
      fromDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      toDate: new Date().toISOString(),
    };

    try {
      await this.hcmSyncService.sync(payload);
    } catch (error) {
      this.logger.error('Scheduled sync failed', error);
    }
  }
}
