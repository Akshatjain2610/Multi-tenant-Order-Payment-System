import { IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsString()
  idempotencyKey: string;
}
