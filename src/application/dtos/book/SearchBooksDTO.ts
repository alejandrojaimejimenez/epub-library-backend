import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class SearchBooksDTO {
  @IsString()
  @IsOptional()
  public q?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  public author?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  public tag?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  public series?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  public offset?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  public limit?: number;
}
