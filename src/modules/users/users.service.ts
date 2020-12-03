import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    @InjectRepository(Product)
    private usersRepository: Repository<User>,
    private productsRepository: Repository<User>,
  ) {}

  async addProduct(name: string, description: string): Promise<Product> {
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
