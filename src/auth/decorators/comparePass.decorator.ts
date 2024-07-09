import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'ComparePassword', async: false })
export class ComparePassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (args.object['newPassword'] !== password) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Las contraseñas enviadas no coinciden';
  }
}
