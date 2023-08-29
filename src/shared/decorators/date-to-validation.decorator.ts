import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

import { MESSAGES } from "shared/constants/messages.constants";
import { CommonHelpers } from "shared/helpers/common.helpers";

export function DateToValidation(
  dateFromPropertyName: string,
  additionTimeInMilliseconds?: number,
  validationOptions?: ValidationOptions
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [dateFromPropertyName, additionTimeInMilliseconds],
      validator: DateToValidationConstraint,
    });
  };
}

@ValidatorConstraint({ name: "DateToValidation", async: false })
class DateToValidationConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    try {
      const fromDate = new Date((args.object as unknown)[args.constraints[0]]).getTime();
      const addition = args.constraints[1];
      const toDate = new Date(value).getTime();
      return fromDate + (addition || 0) <= toDate;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const hasAdditionalTime = args.constraints[1];
    if (hasAdditionalTime) {
      return `${args.property} require greater than equals ${args.constraints[0]}${
        args.constraints[1] ? " +" + args.constraints[1] + " milliseconds" : ""
      }`;
    }

    return CommonHelpers.formatMessageString(MESSAGES.MUST_BE_GREATER_THAN_OR_EQUAL_TO, args.property, args.constraints[0]);
  }
}
