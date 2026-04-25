import { IsDateString, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTimeOffRequestDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  locationId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsInt()
  @IsPositive()
  days!: number;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
