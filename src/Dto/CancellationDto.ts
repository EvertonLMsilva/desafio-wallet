import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CancellationDto {
  @ApiProperty({
    description: 'Este id é utilizado para encontrar o usuário!',
    example: '1',
  })
  @IsNotEmpty()
  idAccount: number;

  @ApiProperty({
    description: 'Código da transação a qual vai ser feito o cancelamento!',
    example: '6a1fa154-da81-4679-bb36-3354b797e327',
  })
  @IsNotEmpty()
  codeTransaction?: string;

  @ApiProperty({
    description: 'Descrição do cancelamento!',
    example: 'Compra na TechCrazy',
  })
  @IsNotEmpty()
  description?: string;
}
