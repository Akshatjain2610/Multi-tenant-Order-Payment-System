import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;
}
