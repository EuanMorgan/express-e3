import {FilterQuery, HydratedDocument} from 'mongoose';
import SessionModel, {SessionDocument} from '../models/session.model';
import {UserDocument} from '../models/user.model';
import {signJwt, verifyJwt} from '../utils/jwt.utils';
import {get} from 'lodash';
import {findUser} from './user.service';
import config from 'config';
export async function createSession(
  userId: HydratedDocument<UserDocument>['_id'],
  userAgent: string
) {
  const session = await SessionModel.create({
    user: userId,
    userAgent,
  });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: Partial<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reissueAccessToken(refreshToken: string) {
  const {decoded} = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, '_id')) return false;

  const session = await SessionModel.findById(get(decoded, 'session'));
  if (!session || !session.valid) return false;

  const user = await findUser({
    _id: session.user,
  });

  if (!user) return false;

  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('accessTokenTtl'), // 15 mins
    }
  );

  return accessToken;
}
