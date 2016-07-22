'use strict';


/**
 * @module api/public
 */


const express = require('express');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();

  router.post('/login', (req, res) => {
    let user;
    switch (req.body.action) {
      case 'login':
        user = data.find(u => (
          u.username === req.body.user && u.password === req.body.pass
        ));
        if (user) {
          const token = user.token;
          res.status(200).json({ token });
        } else {
          res.status(400).json({ error: 'some error' });
        }
        break;
      default:
        res.status(400).send('no action');
    }
  });

  router.get('/info', (req, res) => {
    res.status(200).json({
      'instance-key': 'qorus-test-instance',
      'omq-version': '3.2.0_git',
      'omq-build': 'd086f3843c4f25547821f3f1a45a61673792b6e7',
      'qore-version': '0.8.13',
      noauth: false,
    });
  });

  return router;
};
