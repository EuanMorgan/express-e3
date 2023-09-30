import {type Express} from 'express';
import {createUserHandler} from './controllers/user.controller';
import validateResource from './middleware/validateResource';
import {createUserInputSchema} from './schemas/user.schema';
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from './controllers/session.controller';
import {createSessionInputSchema} from './schemas/session.schema';
import {requireUser} from './middleware/requireUser';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from './controllers/product.controller';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schemas/product.schema';
function routes(app: Express) {
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.post(
    '/api/users',
    validateResource(createUserInputSchema),
    createUserHandler
  );
  app.post(
    '/api/sessions',
    validateResource(createSessionInputSchema),
    createUserSessionHandler
  );

  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  app.post(
    '/api/products',
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );
  app.put(
    '/api/products/:productId',
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  );
  app.get(
    '/api/products/:productId',
    validateResource(getProductSchema),
    getProductHandler
  );
  app.delete(
    '/api/products/:productId',
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
