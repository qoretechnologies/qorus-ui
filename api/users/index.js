'use strict';


/**
 * @module api/users
 */


const express = require('express');

const rest = require('../rest');


module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.get('/', (req, res, next) => {
    if (req.query.action === 'current') {
      req.url = `/${data[0].username}`; // eslint-disable-line no-param-reassign
    }

    next();
  });
  router.use(rest(data, (id, u) => u.username === id));

  router.post('/auth', (req, res) => {
    let user;
    switch (req.body.action) {
      case 'login':
        user = data.find(u => (
          u.username === req.body.login && u.password === req.body.password
        ));
        if (user) {
          const token = `sometkn ${Math.random(1, 100)}`;
          res.status(200).json({ token });
        } else {
          res.status(400).json({ error: 'some error' });
        }
        break;
      default:
        res.status(400).send('no action');
    }
  });

  return router;
};
