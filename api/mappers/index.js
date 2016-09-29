import { Router } from 'express';
import getData from './data';

module.exports = () => {
  const router = new Router();
  const data = getData();

  router.get('/', (req, res) => {
    res.json(data);
  });

  router.get('/:id', (req, res) => {
    const mapper = data.find(item => item.mapperid === parseInt(req.params.id, 10));
    if (mapper) {
      res.json(mapper);
    } else {
      res.status(404).send('Not found');
    }
  });

  return router;
};
