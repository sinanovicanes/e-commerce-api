import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
  isURL,
} from 'class-validator';

@ValidatorConstraint()
export class IsImageUrlConstraint implements ValidatorConstraintInterface {
  validate(url: any, args: ValidationArguments) {
    const isValidURL = isURL(url, {
      protocols: ['https'],
    });

    if (!isValidURL) return false;

    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.tiff',
      '.webp',
    ];
    const urlLower = url.toLowerCase();
    return imageExtensions.some((ext) => urlLower.endsWith(ext));
  }

  defaultMessage(args: ValidationArguments) {
    return 'URL must be a valid image URL';
  }
}

export function IsImageUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsImageUrlConstraint,
    });
  };
}
