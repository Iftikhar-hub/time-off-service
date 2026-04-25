import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TimeOffRequestService } from './time-off-request.service';
import { CreateTimeOffRequestDto } from './dto/create-time-off-request.dto';
import { UpdateTimeOffRequestStatusDto } from './dto/update-time-off-request-status.dto';

@Controller('time-off-requests')
export class TimeOffRequestController {
  constructor(private readonly service: TimeOffRequestService) {}

  @Post()
  create(@Body() dto: CreateTimeOffRequestDto) {
    return this.service.createRequest(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.service.findByEmployee(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTimeOffRequestStatusDto) {
    return this.service.updateStatus(id, dto);
  }
}
