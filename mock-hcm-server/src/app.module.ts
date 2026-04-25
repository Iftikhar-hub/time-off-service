import { Module } from '@nestjs/common';
import { HcmController } from './hcm/hcm.controller';
import { HcmService } from './hcm/hcm.service';

@Module({
  controllers: [HcmController],
  providers: [HcmService],
})
export class AppModule {}
