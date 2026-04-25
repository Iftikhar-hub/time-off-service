import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeOffRequestRepository } from './time-off-request.repository';
import { CreateTimeOffRequestDto } from './dto/create-time-off-request.dto';
import { UpdateTimeOffRequestStatusDto } from './dto/update-time-off-request-status.dto';
import { HcmSyncService } from '../hcm-sync/hcm-sync.service';

@Injectable()
export class TimeOffRequestService {
  constructor(
    private readonly repository: TimeOffRequestRepository,
    private readonly hcmSyncService: HcmSyncService,
  ) {}

  async createRequest(dto: CreateTimeOffRequestDto) {
    await this.hcmSyncService.validateBalance(dto.employeeId, dto.locationId, dto.days);
    return this.repository.create(dto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new NotFoundException('Time off request not found');
    }
    return request;
  }

  findByEmployee(employeeId: string) {
    return this.repository.findByEmployee(employeeId);
  }

  async updateStatus(id: string, dto: UpdateTimeOffRequestStatusDto) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException('Time off request not found');
    }
    return this.repository.updateStatus(id, dto.status);
  }
}
