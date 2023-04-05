import { User } from '../entities/user.entity';

export type ExistUserFiels = Partial<
  Pick<User, 'walletAddress' | 'username' | 'email'>
>;
