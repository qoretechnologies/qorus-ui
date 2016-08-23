'use strict';

/**
 * @module api/users
 */

const express = require('express');
const rest = require('../rest');

import remove from 'lodash/remove';
import includes from 'lodash/includes';
import {
  permsData as data,
  rolesData,
} from '../fixtures';

module.exports = () => {
  const router = new express.Router();

  router.use(rest(data, (id, p) => p.name === id));

  router.post('/', (req, res) => {
    const { name, desc } = req.body;

    const permObj = {
      name,
      permission_type: 'SYSTEM',
      desc,
    };

    data.push(permObj);
    res.json(permObj);
  });

  router.delete('/:perm', (req, res) => {
    const perm = req.params.perm;

    remove(data, p => p.name === perm);

    rolesData.map(role => {
      if (!includes(role.permissions, perm)) return role;

      const newRole = role;
      remove(newRole.permissions, val => val === perm);

      return newRole;
    });

    res.status(200).json('Permission successfuly deleted');
  });

  router.put('/:perm', (req, res) => {
    const perm = req.params.perm;
    const { desc } = req.body;
    const item = data.find(p => p.name === perm);

    item.desc = desc;

    res.json(item);
  });

  return router;
};
