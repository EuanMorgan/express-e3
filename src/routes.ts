import {type Express} from 'express';
function routes(app: Express) {
  app.get('/ping', (req, res) => {
    res.send('pong');
  });
}

export default routes;
