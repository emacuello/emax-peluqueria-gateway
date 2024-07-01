import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);

    return this.productsService.findOne(id);
  }
}
