import { Test, TestingModule } from '@nestjs/testing';
import { TimeOffRequestService } from '../../src/modules/time-off-request/time-off-request.service';
import { TimeOffRequestRepository } from '../../src/modules/time-off-request/time-off-request.repository';
import { HcmSyncService } from '../../src/modules/hcm-sync/hcm-sync.service';
import { RequestStatus } from '../../src/common/enums/request-status.enum';

describe('TimeOffRequestService', () => {
  let service: TimeOffRequestService;
  let repository: Partial<TimeOffRequestRepository>;
  let hcmSyncService: Partial<HcmSyncService>;

  beforeEach(async () => {
    repository = {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: '1', status: RequestStatus.PENDING, ...dto })),
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn().mockResolvedValue(null),
      findByEmployee: jest.fn().mockResolvedValue([]),
      updateStatus: jest.fn().mockResolvedValue({ id: '1', status: RequestStatus.APPROVED }),
    };

    hcmSyncService = {
      validateBalance: jest.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeOffRequestService,
        { provide: TimeOffRequestRepository, useValue: repository },
        { provide: HcmSyncService, useValue: hcmSyncService },
      ],
    }).compile();

    service = module.get<TimeOffRequestService>(TimeOffRequestService);
  });

  it('should create a request after validating HCM balance', async () => {
    const dto = {
      employeeId: '100',
      locationId: 'NYC',
      startDate: '2026-05-01',
      endDate: '2026-05-03',
      days: 2,
      reason: 'Vacation',
    };

    const result = await service.createRequest(dto as any);

    expect(hcmSyncService.validateBalance).toHaveBeenCalledWith('100', 'NYC', 2);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('status', RequestStatus.PENDING);
  });
});
