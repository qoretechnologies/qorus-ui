import { Router } from 'express';
import { valuemapsData as data, valuesData } from '../fixtures';

module.exports = () => {
  const router = new Router();

  router.get('/', (req, res) => {
    res.json(data);
  });

  router.get('/:id/values', (req, res) => {
    const { id } = req.params;
    const values = valuesData.find((val) => {
      let result = true;

      Object.keys(val).forEach(v => {
        result = val[v].value_map_id === parseInt(id, 10);
      });

      return result;
    });

    res.json(values);
  });

  router.get('/:id', (req, res) => {
    if (req.query.action === 'dump') {
      res.json({
        [`valuemap${req.params.id}`]: 'This is a test',
      });
    }
    res.status(404).send();
  });

  router.put('/:id', (req, res) => {
    const { enabled, key, value } = req.body;
    const items = valuesData.find((val) => {
      let result = false;

      Object.keys(val).forEach((v) => {
        if (v === key) {
          result = true;
        }
      });

      return result;
    }) || {};

    if (!value) {
      delete items[key];
    } else {
      if (!items[key]) {
        items[key] = {
          value_map_id: parseInt(req.params.id, 10),
        };
      }

      items[key].enabled = enabled;
      items[key].value = value;
    }

    res.json('UPDATED');
  });

  return router;
};
