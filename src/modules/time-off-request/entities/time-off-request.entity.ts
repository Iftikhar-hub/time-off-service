import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RequestStatus } from '../../../common/enums/request-status.enum';

@Entity({ name: 'time_off_requests' })
export class TimeOffRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  employeeId!: string;

  @Column()
  locationId!: string;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column('int')
  days!: number;

  @Column({ type: 'varchar', length: 32, default: RequestStatus.PENDING })
  status!: RequestStatus;

  @Column({ nullable: true })
  reason!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
