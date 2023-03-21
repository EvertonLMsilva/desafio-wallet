import { IsEmpty, IsNotEmpty } from "class-validator";
import { DescriptionError } from "../types/DescriptionError";

export class ErrorCreateTransactionDto {
    @IsEmpty()
    codeTransaction?: string;
    
    @IsNotEmpty()
    description: DescriptionError;
};
