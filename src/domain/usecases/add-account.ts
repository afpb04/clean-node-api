import { IAccountModel } from '../models/account';

export interface IAddAccountModel {
  name: string;
  email: string;
  password: string;
}
export interface IAddAccount {
  add({ name, email, password }: IAddAccountModel): Promise<IAccountModel>;
}
