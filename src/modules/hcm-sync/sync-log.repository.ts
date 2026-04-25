import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncLog } from './entities/sync-log.entity';
import { SyncTrigger } from '../../common/enums/sync-trigger.enum';

@Injectable()
export class SyncLogRepository {
  constructor(
    @InjectRepository(SyncLog)
    private readonly repository: Repository<SyncLog>,
  ) {}

  async log(entry: Partial<SyncLog>) {
    const log = this.repository.create({
      trigger: entry.trigger ?? SyncTrigger.MANUAL,
      status: entry.status ?? 'PENDING',
      details: entry.details ? JSON.stringify(entry.details) : null,
    });
    return this.repository.save(log);
  }

  findAll() {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: string) {
    const log = await this.repository.findOne({ where: { id } });
    if (!log) {
      return null;
    }
    log.status = status;
    return this.repository.save(log);
  }
}
