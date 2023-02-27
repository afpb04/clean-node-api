import validator from 'validator';

import { IEmailValidation } from '../presentation/protocols/email-validation';

export class EmailValidatorAdapter implements IEmailValidation {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
