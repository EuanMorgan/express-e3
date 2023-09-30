import type {NextFunction, Request, Response} from 'express';
import {get} from 'lodash';
import {User} from '../types';
import {verifyJwt} from '../utils/jwt.utils';
import {reissueAccessToken} from '../services/session.service';
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  const refreshToken = get(req, 'headers.x-refresh');
  if (!accessToken) return next();

  const {decoded, expired, valid} = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded as User;
  }

  if (expired && refreshToken) {
    const newAccessToken = await reissueAccessToken(refreshToken as string);
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
      const result = verifyJwt(newAccessToken);

      res.locals.user = result.decoded as User;
    }

    return next();
  }

  return next();
};
