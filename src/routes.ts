import {type Express} from 'express';
import {createUserHandler} from './controller/user.controller';
import validate from './middleware/validateResource';
import {createUserInputSchema} from './schemas/user.schema';
function routes(app: Express) {
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.post('/api/users', validate(createUserInputSchema), createUserHandler);
}

export default routes;
