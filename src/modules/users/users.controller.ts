import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('products')
  createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<Product> {
    if (!name) {
      throw new HttpException('missing name', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.createProduct(name, description);
  }
}
