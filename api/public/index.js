'use strict';


/**
 * @module api/public
 */


const express = require('express');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();

  router.post('/login', (req, res) => {
    const user = data.find(u => (
      u.username === req.body.user && u.password === req.body.pass
    ));
    if (user) {
      const token = user.token;
      res.status(200).json({ token });
    } else {
      res.status(400).json({
        err: 'AUTHENTICATION-ERROR',
        desc: 'Invalid user or password',
      });
    }
  });

  router.get('/info', (req, res) => {
    const noauth = !!req.headers.noauth && !(req.headers.noauth.toLowerCase() === 'false');
    res.status(200).json({
      noauth,
      'instance-key': 'qorus-test-instance',
      'omq-schema': 'omq@xbox',
      'omq-version': '3.2.0_git',
      'omq-build': 'd086f3843c4f25547821f3f1a45a61673792b6e7',
      'qore-version': '0.8.13',
    });
  });

  return router;
};
