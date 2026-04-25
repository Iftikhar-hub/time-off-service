import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class DeductBalanceDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  locationId!: string;

  @IsInt()
  @Min(1)
  days!: number;
}
