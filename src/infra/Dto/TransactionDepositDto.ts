import { ApiProperty } from "@nestjs/swagger";

export class TransactionDepositDto {
    @ApiProperty({
        description: 'Este id é utilizado para identificar quem vai receber a transação!',
        example: '1'
    })
    idAccount: number;

    @ApiProperty({
        description: 'Esta propriedade deve ser passada para definir o valor da transferencia!',
        example: '100'
    })
    value: number;

    @ApiProperty({
        description: 'Esta propriedade tem a responsabilidade de adicionar algum detalhe da transação.',
        example: 'Depósito na conta XXXX'
    })

    @ApiProperty({
        description: 'Esta propriedade tem a responsabilidade de adicionar algum detalhe da transação.',
        example: '1'
    })
    description: string
}