import express from 'express';
import getJobResults from './data';

module.exports = () => {
  const data = getJobResults();
  const router = new express.Router();

  router.get('', (req, res) => {
    res.json(data);
  });

  router.get('/:id', (req, res) => {
    const resultId = parseInt(req.params.id, 10);
    const jobResult = data.find(item => item.job_instanceid === resultId);

    if (jobResult) {
      res.json(jobResult);
    } else {
      res.statusCode(404).send('Not found');
    }

  });

  return router;
};