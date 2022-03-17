import { badRequest } from '../../helpers/http-helpers';
import { MissingParamError } from '../errors/missing-param-error';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
    return {
      statusCode: 200,
      body: 'Success',
    };
  }
}
