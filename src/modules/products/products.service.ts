import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async createProduct(name: string, description: string): Promise<Product> {
    try {
      const productParams = this.productsRepository.create({
        name,
        description,
      });
      const product = await this.productsRepository.save(productParams);

      return product;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Name already taken',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      throw error;
    }
  }
}
