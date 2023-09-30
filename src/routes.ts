import {type Express} from 'express';
import {createUserHandler} from './controller/user.controller';
import validate from './middleware/validateResource';
import {createUserInputSchema} from './schemas/user.schema';
import {createUserSessionHandler} from './controller/session.controller';
import {createSessionInputSchema} from './schemas/session.schema';
function routes(app: Express) {
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.post('/api/users', validate(createUserInputSchema), createUserHandler);
  app.post(
    '/api/sessions',
    validate(createSessionInputSchema),
    createUserSessionHandler
  );
}

export default routes;
