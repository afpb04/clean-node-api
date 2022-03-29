import { badRequest, serverError } from '../../helpers/http-helpers';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { IController } from '../protocols/controllers';
import { IEmailValidation } from '../protocols/email-validation';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

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
