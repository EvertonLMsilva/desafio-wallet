import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class BalanceDto {   
    @ApiProperty({
        description: 'Este id é utilizado para retornar o saldo da conta!',
        example: '1'
    })
    @IsNotEmpty()
    idAccount: number;
}