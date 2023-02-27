import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/http-helpers';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IEmailValidation,
  IAddAccount,
} from './signup-protocols';

export class SignUpController implements IController {
  private readonly emailValidation: IEmailValidation;
  private readonly addAccount: IAddAccount;

  constructor(emailValidation: IEmailValidation, addAccount: IAddAccount) {
    this.emailValidation = emailValidation;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this.emailValidation.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      const account = await this.addAccount.add({ name, email, password });
      return ok(account);
    } catch (err) {
      return serverError();
    }
  }
}
