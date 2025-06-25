import { IsInt, Min } from 'class-validator';

export class GetBookDTO {
  @IsInt()
  @Min(1)
  id!: number;
}
