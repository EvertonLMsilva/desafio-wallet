import { ApiProperty } from "@nestjs/swagger";

export class DateStatementDto {
    @ApiProperty({
        description: 'Esta propriedade tem a responsabilidade de informar a data inicial da consulta.',
        example: '2023-03-09'
    })
    initialDate: string;
    
    @ApiProperty({
        description: 'Esta propriedade tem a responsabilidade de informar a data final da consulta.',
        example: '2023-03-25'
    })
    finalDate: string;
    
    @ApiProperty({
        description: 'Este id é utilizado para identificar quem vai receber a transação!',
        example: '1'
    })
    idAccount: string;
}