import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { HcmSyncController } from './hcm-sync.controller';
import { HcmSyncService } from './hcm-sync.service';
import { HcmSyncScheduler } from './hcm-sync.scheduler';
import { SyncLogRepository } from './sync-log.repository';
import { SyncLog } from './entities/sync-log.entity';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SyncLog]), BalanceModule],
  controllers: [HcmSyncController],
  providers: [HcmSyncService, HcmSyncScheduler, SyncLogRepository],
  exports: [HcmSyncService],
})
export class HcmSyncModule {}
