import { Controller, Post, Body, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@ApiBearerAuth()
@ApiTags('product')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('kraken')
  async addItems(@Body() createItemsDto: CreateProductDto[]) {
    const generatedIds = await this.productsService.createItems(createItemsDto);
    return { ids: generatedIds };
  }

  @Get()
  getAllProducts() {
    return this.productsService.getProducts();
  }
}
