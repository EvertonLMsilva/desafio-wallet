import { IsNotEmpty } from "class-validator";

export class CancellationDto {
    @IsNotEmpty()
    idAccount: number;
        
    @IsNotEmpty()
    codeTransaction?: string

    @IsNotEmpty()
    description?: string
}