import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(id);

    return await this.productsService.findOne(id);
  }
}
