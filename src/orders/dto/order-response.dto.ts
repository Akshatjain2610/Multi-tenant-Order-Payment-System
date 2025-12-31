import { UserResponseDto } from '../../users/dto/user-response.dto';

export class OrderResponseDto {
  id: number;
  amount: number;
  status: string;
  user: UserResponseDto;
}
