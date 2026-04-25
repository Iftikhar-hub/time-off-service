import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeOffRequestController } from './time-off-request.controller';
import { TimeOffRequestService } from './time-off-request.service';
import { TimeOffRequestRepository } from './time-off-request.repository';
import { TimeOffRequest } from './entities/time-off-request.entity';
import { HcmSyncModule } from '../hcm-sync/hcm-sync.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeOffRequest]), HcmSyncModule],
  controllers: [TimeOffRequestController],
  providers: [TimeOffRequestService, TimeOffRequestRepository],
  exports: [TimeOffRequestService],
})
export class TimeOffRequestModule {}
