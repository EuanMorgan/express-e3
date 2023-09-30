import type {Document} from 'mongoose';
import UserModel, {UserDocument} from '../models/user.model';

export async function createUser(
  input: Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>
) {
  try {
    return await UserModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}
