'use strict';

/**
 * @module api/users
 */

const express = require('express');

import { union, remove } from 'lodash';
import {
  usersData as data,
  rolesData,
} from '../fixtures';

module.exports = () => {
  const router = new express.Router();
  router.get('/', (req, res, next) => {
    if (req.query.action === 'current') {
      const user = data.find(u => (
        u.token === req.headers['qorus-token']
      ));
      req.url = `/${user.username}`; // eslint-disable-line no-param-reassign
    }

    next();
  });

  router.get('/', (req, res) => {
    data.map(user => {
      const newUser = user;
      let permissions = [];

      newUser.roles.forEach(role => {
        permissions = permissions.concat(rolesData.find(r => r.role === role).permissions);
      });

      newUser.permissions = union(permissions);

      return newUser;
    });

    res.json(data);
  });
  router.get('/:id', (req, res) => {
    const user = data.find(u => u.username === req.params.id);

    let permissions = [];

    user.roles.forEach(role => {
      permissions = permissions.concat(rolesData.find(r => r.role === role).permissions);
    });

    user.permissions = union(permissions);

    res.json(user);
  });

  router.post('/', (req, res) => {
    const { username, pass, name, roles } = req.body;
    let permissions = [];

    roles.forEach(role => {
      permissions = permissions.concat(rolesData.find(r => r.role === role).permissions);
    });

    permissions = union(permissions);

    const user = {
      provider: 'db',
      username,
      password: pass,
      token: `${username}tkn`,
      name,
      roles,
      permissions,
    };

    data.push(user);
    res.json(user);
  });

  router.delete('/:username', (req, res) => {
    const username = req.params.username;

    remove(data, user => user.username === username);

    res.status(200).json('User successfuly deleted');
  });

  router.put('/:username', (req, res) => {
    const username = req.params.username;
    const user = data.find(u => u.username === username);

    if (req.body.storage) {
      const { storage } = req.body;
      const currentStorage = user.storage;

      user.storage = { ...currentStorage, ...storage };
      res.json('OK');
    } else {
      const { roles, name } = req.body;

      user.name = name;
      user.roles = roles;
      res.json(user);
    }
  });

  return router;
};
