import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Product } from '../../entities/product.entity';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Post('products')
  createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<Product> {
    if (!name) {
      throw new HttpException('missing name', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.createProduct(name, description);
  }
}
