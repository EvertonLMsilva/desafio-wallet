import { IsNotEmpty } from "class-validator";
export class DateStatementDto {
    @IsNotEmpty()
    initialDate: string;
    
    @IsNotEmpty()
    finalDate: string;
    
    @IsNotEmpty()
    idAccount: string;
}