'use strict';


/**
 * @module api/login
 */


const express = require('express');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();

  router.post('/', (req, res) => {
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
