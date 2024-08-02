import { IsValidPassword } from '@/utils/validators';

export class ResetPasswordDto {
  @IsValidPassword()
  password: string;
}
