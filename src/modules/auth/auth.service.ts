/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthPayload } from '../../payload/auth';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'my5up3rs3cr3tk3y';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<AuthPayload> {
    try {
      const hash = await bcrypt.hash(password, 10);
      const userParams = this.usersRepository.create({ email, password: hash });
      const user = await this.usersRepository.save(userParams);
      const token = jwt.sign({ email: user.email }, secret);

      delete user.password;
      return {
        user,
        token,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Email already taken',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      console.log(error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.usersRepository.findOne({ email });

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      delete user.password;
      const token = jwt.sign({ email: user.email }, secret);

      return {
        user,
        token,
      };
    }

    throw new HttpException('bad login / password', HttpStatus.BAD_REQUEST);
  }
}
