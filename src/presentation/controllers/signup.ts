import { IAddAccount } from '../../domain/usecases/add-account';
import { badRequest, serverError } from '../../helpers/http-helpers';
import { InvalidParamError, MissingParamError } from '../errors';
import {
  IController,
  IEmailValidation,
  IHttpRequest,
  IHttpResponse,
} from '../protocols';

export class SignUpController implements IController {
  private readonly emailValidation: IEmailValidation;
  private readonly addAccount: IAddAccount;

  constructor(emailValidation: IEmailValidation, addAccount: IAddAccount) {
    this.emailValidation = emailValidation;
    this.addAccount = addAccount;
  }

  handle(httpRequest: IHttpRequest): IHttpResponse {
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
      this.addAccount.add({ name, email, password });
      return {
        statusCode: 200,
        body: 'Success',
      };
    } catch (err) {
      return serverError();
    }
  }
}
