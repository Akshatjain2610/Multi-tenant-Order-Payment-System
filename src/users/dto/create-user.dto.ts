import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Email for creating user",
    example: "example@example.com",    
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "min 6 digit string password which contains UPPERCASE, LOWERCASE, NUMERIC VALUES",
    example: "Abcde@123"
  })
  @IsString()
  @MinLength(6)
  password: string;
}
