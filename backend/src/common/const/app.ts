import { User } from 'src/users/entities/user.entity';

export const staticFolder = 'static';
export const uploadsFolder = 'uploads';
export const assetsFolder = 'assets';

export const trueValues = [true, 'enabled', 'true', 1, '1'];
export const falseValues = [false, 'false', 0, '0'];

interface IValidationParams {
  exist?: string;
  notValid?: string;
  notFound?: string;
  min?: string;
  max?: string;
}

export const userValidationMessages: Partial<
  Record<keyof User, IValidationParams>
> = {
  email: {
    notValid: 'Wrong format. Make sure to provide a valid email address',
    notFound:
      "Account with this email isn't found. Make sure to provide a valid email address",
    exist: 'This email is already in use',
  },
  username: { exist: 'This username is already in use' },
  password: {
    min: 'Password must be longer than or equal to 5 characters',
    max: 'Password must be shorter than or equal to 15 characters',
  },
};
