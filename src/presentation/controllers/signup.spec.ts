import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { IEmailValidation } from '../protocols';
import { SignUpController } from './signup';

interface ISutTypes {
  sut: SignUpController;
  emailValidationStub: IEmailValidation;
}

const makeEmailValidator = (): IEmailValidation => {
  class EmailValidationStub implements IEmailValidation {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidationStub();
};
const makeSut = (): ISutTypes => {
  const emailValidationStub = makeEmailValidator();
  const sut = new SignUpController(emailValidationStub);
  return {
    sut,
    emailValidationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: '123123',
        passwordConfirmation: '123123',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        password: '123123',
        passwordConfirmation: '123123',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        passwordConfirmation: '123123',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        password: '123123',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidationStub } = makeSut();
    jest.spyOn(emailValidationStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'name',
        email: 'invalid_email@mail.com',
        password: '123123',
        passwordConfirmation: '123456',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidationStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidationStub, 'isValid');
    const httpRequest = {
      body: {
        name: 'name',
        email: 'any_email@mail.com',
        password: '123123',
        passwordConfirmation: '123456',
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
  test('Should return 500 if EmailValidation throws', () => {
    const { sut, emailValidationStub } = makeSut();
    jest.spyOn(emailValidationStub, 'isValid').mockImplementation(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'name',
        email: 'any_email@mail.com',
        password: '123123',
        passwordConfirmation: '123456',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
