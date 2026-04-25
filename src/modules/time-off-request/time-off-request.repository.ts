import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeOffRequest } from './entities/time-off-request.entity';
import { CreateTimeOffRequestDto } from './dto/create-time-off-request.dto';
import { RequestStatus } from '../../common/enums/request-status.enum';

@Injectable()
export class TimeOffRequestRepository {
  constructor(
    @InjectRepository(TimeOffRequest)
    private readonly repository: Repository<TimeOffRequest>,
  ) {}

  create(dto: CreateTimeOffRequestDto) {
    const request = this.repository.create({
      employeeId: dto.employeeId,
      locationId: dto.locationId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      days: dto.days,
      reason: dto.reason,
      status: RequestStatus.PENDING,
    });
    return this.repository.save(request);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  findByEmployee(employeeId: string) {
    return this.repository.find({ where: { employeeId } });
  }

  updateStatus(id: string, status: RequestStatus) {
    return this.repository.save({ id, status });
  }
}
