import { User } from '../entities/user.entity';

export interface AuthPayload {
  user: User;
  token: string;
}
