import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { SyncTrigger } from '../../../common/enums/sync-trigger.enum';

export class BatchSyncPayloadDto {
  @IsEnum(SyncTrigger)
  trigger!: SyncTrigger;

  @IsISO8601()
  fromDate!: string;

  @IsISO8601()
  toDate!: string;

  @IsOptional()
  @IsString()
  employeeId?: string;
}
