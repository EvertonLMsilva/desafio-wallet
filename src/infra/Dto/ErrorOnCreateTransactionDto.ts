import { IsEmpty, IsNotEmpty } from "class-validator";

export class ErrorCreateTransactionDto {
    @IsEmpty()
    codeTransaction?: string;
    
    @IsNotEmpty()
    description: DescriptionError;
};

type DescriptionError = {
    module: string;
    specification: string;
    message: string;
}