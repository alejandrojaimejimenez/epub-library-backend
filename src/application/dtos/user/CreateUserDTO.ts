import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(3, 50)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 100)
  password!: string;
}
