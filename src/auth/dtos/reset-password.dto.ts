import { IsValidPassword } from '@/utils/validators';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsValidPassword()
  password: string;
}
