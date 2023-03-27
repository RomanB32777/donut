import { User } from '../entities/user.entity';

export type ExistUserFiels = Partial<
  Pick<User, 'walletAddress' | 'username' | 'email'>
>;

export type QueryRole = Partial<Pick<User, 'roleplay'>>;
