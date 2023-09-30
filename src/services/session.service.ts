import {FilterQuery, HydratedDocument} from 'mongoose';
import SessionModel, {SessionDocument} from '../models/session.model';
import {UserDocument} from '../models/user.model';

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
