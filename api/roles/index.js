'use strict';

/**
 * @module api/users
 */

const express = require('express');
const rest = require('../rest');
import remove from 'lodash/remove';
import includes from 'lodash/includes';
import {
  rolesData as data,
  usersData,
} from '../fixtures';

module.exports = () => {
  const router = new express.Router();

  router.use(rest(data, (id, r) => r.role === id));

  router.post('/', (req, res) => {
    const { role, desc, perms, groups } = req.body;

    const roleObj = {
      role,
      provider: 'db',
      desc,
      has_default: true,
      permissions: perms,
      groups,
    };

    data.push(roleObj);
    res.json(roleObj);
  });

  router.delete('/:role', (req, res) => {
    const role = req.params.role;

    remove(data, r => r.role === role);

    usersData.map(user => {
      if (!includes(user.roles, role)) return user;

      const newUser = user;
      remove(newUser.roles, val => val === role);

      return newUser;
    });

    res.status(200).json('Role successfuly deleted');
  });

  router.put('/:role', (req, res) => {
    const role = req.params.role;
    const { perms, groups, desc } = req.body;
    const item = data.find(r => r.role === role);

    item.desc = desc;
    item.permissions = perms;
    item.groups = groups;

    res.json(item);
  });

  return router;
};
