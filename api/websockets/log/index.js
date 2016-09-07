import express from 'express';
import bodyParser from 'body-parser';

module.exports = () => {
  const router = new express.Router();

  router.use(bodyParser.json());

  router.ws('/:type', (ws, req) => {
    const id = req.params.id ? ` and id ${req.params.id}` : '';
    const interval = setInterval(() => {
      ws.send(`This is a test log message for ${req.params.type}${id}`, (error) => {
        if (error) {
          clearInterval(interval);
        }
      });
    }, 2000);
  });

  router.ws('/:type/:id', (ws, req) => {
    const interval = setInterval(() => {
      ws.send(
        `This is a test log message for ${req.params.type} and id: ${req.params.id}`,
        (error) => {
          if (error) {
            clearInterval(interval);
          }
        });
    }, 2000);
  });

  return router;
};
