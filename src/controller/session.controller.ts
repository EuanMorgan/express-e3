import {Request, Response} from 'express';
import {validatePassword} from '../services/user.service';
import {createSession} from '../services/session.service';
import {signJwt} from '../utils/jwt.utils';
import config from 'config';
export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }
  // Create a session
  const session = await createSession(user._id, req.get('user-agent') || '');
  // Create access token
  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('accessTokenTtl'), // 15 mins
    }
  );
  // Create refresh token

  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('refreshTokenTtl'), // 30 days
    }
  );
  // Send refresh & access token back

  return res.send({accessToken, refreshToken});
}
