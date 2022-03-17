import { badRequest } from '../../helpers/http-helpers';
import { MissingParamError } from '../errors/missing-param-error';
import { IController } from '../protocols/controllers';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

export class SignUpController implements IController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
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
    return {
      statusCode: 200,
      body: 'Success',
    };
  }
}
