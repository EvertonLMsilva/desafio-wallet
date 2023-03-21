import { ApiProperty } from "@nestjs/swagger";

export class TransactionConsumerDto {
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
        description: 'Esta propriedade tem a responsabilidade de passar o codigo unico para a transação, evitando duplicidade.',
        example: 'asdasd2wd8a7sd68asd7'
    })
    codeTransaction?: string

    @ApiProperty({
        description: 'Esta propriedade tem a responsabilidade de adicionar algum detalhe da transação.',
        example: '1'
    })
    description: string
}