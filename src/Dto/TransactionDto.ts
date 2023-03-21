import { IsEmpty, IsNotEmpty } from "class-validator";

export class TransactionDto {
    @IsNotEmpty()
    idAccount: number;
    
    @IsNotEmpty()
    value: number;

    @IsEmpty()
    codeTransaction?: string;
}