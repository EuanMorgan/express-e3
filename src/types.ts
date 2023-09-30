import {Response as ExpressResponse, Request} from 'express';
import {UserDocument} from './models/user.model';
import {HydratedDocument} from 'mongoose';

export type User = HydratedDocument<
  Omit<UserDocument, 'password' | 'comparePassword'>
> & {
  session?: string;
};

declare module 'express' {
  export interface Response {
    locals: {
      user?: User;
    };
  }
}
