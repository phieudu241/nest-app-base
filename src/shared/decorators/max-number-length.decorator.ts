import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

import { MESSAGES } from "shared/constants/messages.constants";
import { CommonHelpers } from "shared/helpers/common.helpers";

@ValidatorConstraint({ name: "maxNumberLength", async: false })
class MaxNumberLengthValidator implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const maxLength = args.constraints[0];

    const stringValue = value ? value.toString() : "";

    return stringValue.length <= maxLength;
  }

  defaultMessage(args: ValidationArguments) {
    const maxLength = args.constraints[0];
    return CommonHelpers.formatMessageString(MESSAGES.REQUIRED_MAX_LENGTH, maxLength);
  }
}

export function MaxNumberLength(maxLength: number, validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxLength],
      validator: MaxNumberLengthValidator,
    });
  };
}
