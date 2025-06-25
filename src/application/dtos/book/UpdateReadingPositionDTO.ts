import { IsInt, Min, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateReadingPositionDTO {
  @IsInt()
  @Min(1)
  bookId!: number;

  @IsString()
  @IsOptional()
  format?: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  device?: string;

  @IsString()
  @IsOptional()
  cfi?: string;

  @IsNumber()
  @Min(0)
  position!: number;
}
