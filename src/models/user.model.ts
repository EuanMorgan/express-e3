import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candiatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candiatePassword, user.password).catch(e => false);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
