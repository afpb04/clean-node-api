import { IEmailValidation } from '../presentation/protocols/email-validation';

export class EmailValidatorAdapter implements IEmailValidation {
  isValid(email: string): boolean {
    return false;
  }
}
