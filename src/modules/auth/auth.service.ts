import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({ email, password: hash });

    this.usersRepository.save(user);

    delete user.password;
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      delete user.password;
      return user;
    }

    throw new HttpException('bad login / password', HttpStatus.BAD_REQUEST);
  }
}
