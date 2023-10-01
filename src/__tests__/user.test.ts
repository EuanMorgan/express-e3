import mongoose from 'mongoose';
import {
  createUserSessionHandler,
  getUserSessionsHandler,
} from '../controllers/session.controller';
import * as UserService from '../services/user.service';
import * as SessionService from '../services/session.service';
import supertest from 'supertest';
import {createServer} from '../utils/server';
import {omit} from 'lodash';

const userId = new mongoose.Types.ObjectId();

export const userPayload = {
  _id: userId.toString(),
  email: 'test@example.com',
  name: 'Test User',
};
const userInput = {
  email: 'test@example.com',
  password: 'password123',
  passwordConfirmation: 'password123',
  name: 'Test User',
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId.toString(),
  valid: true,
  userAgent: 'PostmanRuntime/7.26.8',
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

const app = createServer();

describe('User', () => {
  describe('user registration', () => {
    describe('given the username and password are valid', () => {
      it('should return a 200 and create a user', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const {statusCode, body} = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(
          omit(userInput, 'passwordConfirmation')
        );
      });
    });

    describe('given the passwords do not match', () => {
      it('should return a 400', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const {statusCode, body} = await supertest(app)
          .post('/api/users')
          .send({...userInput, passwordConfirmation: 'doesnotmatch'});

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe('given the user service throws', () => {
      it('should handle the error and return a 409', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockRejectedValue('oops :(');

        const {statusCode, body} = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe('create a session', () => {
    describe('given the username and password are valid', () => {
      it('should return a 200 and a signed access / refresh token', async () => {
        jest
          .spyOn(UserService, 'validatePassword')
          // @ts-ignore
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, 'createSession')
          // @ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return 'a user agent';
          },
          body: {
            email: 'test@example.com',
            password: 'password123',
          },
        };

        const send = jest.fn();

        const res = {
          send,
        };

        // @ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
