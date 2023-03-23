import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";

export class PurchaseDto {
    @ApiProperty({
        description: 'Este id é utilizado para identificar o usuário!',
        example: '1'
    })
    @IsNotEmpty()
    idAccount: number;
    
    @ApiProperty({
        description: 'Valor da compra!',
        example: '100'
    })
    @IsNotEmpty()
    value: number;

    @ApiProperty({
        description: 'Descrição da compra!',
        example: 'Compra na loja TECHCRAZY'
    })
    @IsNotEmpty()
    description?: string
}