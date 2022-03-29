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
  constructor(emailValidation: IEmailValidation) {
    this.emailValidation = emailValidation;
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
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this.emailValidation.isValid(httpRequest.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      return {
        statusCode: 200,
        body: 'Success',
      };
    } catch (err) {
      return serverError();
    }
  }
}
