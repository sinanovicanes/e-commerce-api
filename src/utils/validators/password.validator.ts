import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isStrongPassword,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return isStrongPassword(text, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password is not strong enough (minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number)';
  }
}

export function IsValidPassword(
  validationOptions: ValidationOptions = {
    message:
      'Password is not strong enough (minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number)',
  },
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidPasswordConstraint,
    });
  };
}
