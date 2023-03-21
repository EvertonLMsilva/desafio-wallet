import { IsEmpty, IsNotEmpty } from "class-validator";

export class PurchaseDto {
    @IsNotEmpty()
    idAccount: number;
    
    @IsNotEmpty()
    value: number;
    
    @IsEmpty()
    codeTransaction?: string

    @IsNotEmpty()
    description?: string
}