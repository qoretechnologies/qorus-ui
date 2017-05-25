import { Router } from 'express';
import getData from './data';
import includes from 'lodash/includes';
import moment from 'moment';

module.exports = () => {
  const router = new Router();
  const data = getData()[0];

  router.get('/', (req, res) => {
    let resp = data;

    if (req.query.file_name && req.query.file_name !== '') {
      resp = resp.filter((release) => {
        if (!release.files) return false;

        return release.files.some((file) => includes(file.name, req.query.file_name));
      });
    }

    if (req.query.mindate) {
      resp = resp.filter(release => moment(release.created).isAfter(
        moment(req.query.mindate, 'YYYY-MM-DD HH:mm:ss').format()
      ));
    }

    if (req.query.maxdate) {
      resp = resp.filter(release => moment(release.created).isBefore(
        moment(req.query.maxdate, 'YYYY-MM-DD HH:mm:ss').format()
      ));
    }

    if (req.query.limit) {
      const start = parseInt(req.query.offset, 10) || 0;
      const end = parseInt(req.query.limit, 10);

      resp = resp.slice(start, start + end);
    }

    res.json(resp);
  });

  return router;
};
