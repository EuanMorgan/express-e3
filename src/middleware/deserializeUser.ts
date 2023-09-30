import type {NextFunction, Request, Response} from 'express';
import {get} from 'lodash';
import {User} from '../types';
import {verifyJwt} from '../utils/jwt.utils';
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );
  if (!accessToken) return next();

  const {decoded, expired, valid} = verifyJwt(accessToken);
  console.log('decoded', decoded);
  if (decoded) {
    res.locals.user = decoded as User;
  }

  return next();
};
