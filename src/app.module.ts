import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { TimeOffRequestModule } from './modules/time-off-request/time-off-request.module';
import { BalanceModule } from './modules/balance/balance.module';
import { HcmSyncModule } from './modules/hcm-sync/hcm-sync.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_NAME || 'sqlite.db',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      logging: false,
    }),
    TimeOffRequestModule,
    BalanceModule,
    HcmSyncModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
