import mongoose, {type HydratedDocument} from 'mongoose';
import {UserDocument} from './user.model';

export interface SessionDocument {
  user: HydratedDocument<UserDocument>['_id'];
  valid: boolean;
  userAgent: string;

  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    valid: {type: Boolean, default: true},
    userAgent: {type: String},
  },

  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model('Session', sessionSchema);

export default SessionModel;
