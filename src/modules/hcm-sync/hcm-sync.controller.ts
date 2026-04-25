import { Body, Controller, Get, Post } from '@nestjs/common';
import { HcmSyncService } from './hcm-sync.service';
import { BatchSyncPayloadDto } from './dto/batch-sync-payload.dto';

@Controller('hcm-sync')
export class HcmSyncController {
  constructor(private readonly syncService: HcmSyncService) {}

  @Post('manual')
  triggerManualSync(@Body() payload: BatchSyncPayloadDto) {
    return this.syncService.sync(payload);
  }

  @Get('logs')
  getLogs() {
    return this.syncService.getLogs();
  }
}
