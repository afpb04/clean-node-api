import { IHttpResponse } from '../presentation/protocols/http';

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error,
});
