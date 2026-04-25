import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HcmService } from './hcm.service';
import { DeductBalanceDto } from './dto/deduct-balance.dto';

@Controller('hcm')
export class HcmController {
  constructor(private readonly service: HcmService) {}

  @Post('deduct-balance')
  deductBalance(@Body() dto: DeductBalanceDto) {
    return this.service.deductBalance(dto);
  }

  @Get('balances/:employeeId/:locationId')
  getBalance(@Param('employeeId') employeeId: string, @Param('locationId') locationId: string) {
    return this.service.getBalance(employeeId, locationId);
  }

  @Get('batch-sync')
  getBatchSync() {
    return this.service.batchSync();
  }
}
