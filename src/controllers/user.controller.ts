import type {Request, Response} from 'express';
import logger from '../utils/logger';
import {createUser} from '../services/user.service';
import {CreateUserInput} from '../schemas/user.schema';
import {omit} from 'lodash';
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) {
  try {
    const {passwordConfirmation, ...userInput} = req.body;
    const user = await createUser(userInput);
    return res.send(omit(user.toJSON(), 'password'));
  } catch (error) {
    logger.error(error);
    res.status(409).send('A user with that email already exists');
  }
}
