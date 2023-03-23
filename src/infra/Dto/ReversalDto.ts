import { IsNotEmpty } from 'class-validator';

export class ReversalDto {
  @IsNotEmpty()
  idAccount: number;

  @IsNotEmpty()
  codeTransaction?: string;

  @IsNotEmpty()
  description?: string;
}
