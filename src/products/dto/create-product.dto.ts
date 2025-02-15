import { IsString, IsArray, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsDateString()
  updated_at: string;

  @IsArray()
  @IsNumber({}, { each: true })
  prices: number[];

  @IsNumber()
  rate: number;

  @IsEnum(['product', 'equipment'])
  category: 'product' | 'equipment';
}