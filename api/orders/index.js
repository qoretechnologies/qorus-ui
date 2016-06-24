'use strict';

/**
 * @module api/services
 */

const findOrder = (id, s) => s.workflow_instanceid === parseInt(id, 10);
const config = require('../config');
const express = require('express');
const moment = require('moment');
const firstBy = require('thenby');
const random = require('lodash').random;
const includes = require('lodash').includes;
const range = require('lodash').range;

const addNote = (order, saved, username, note) => {
  var notes;
  var data = {
    saved,
    username,
    note,
    created: moment().format(),
    modified: moment().format(),
  };

  if (!order.notes) {
    notes = [data];
  } else {
    notes = order.notes.slice().concat(data);
  }

  return {
    note_count: order.note_count + 1,
    notes,
  };
};

const lockOrder = (order, note, username) => {
  var obj = addNote(order, true, username, note);
  obj.operator_lock = username;

  return obj;
};

const unlockOrder = (order, note, username) => {
  var obj = addNote(order, true, username, note);
  obj.operator_lock = null;

  return obj;
};

const canSkip = (step) => {
  return (
      step.stepstatus === 'RETRY' ||
      step.stepstatus === 'ERROR' ||
      step.stepstatus === 'EVENT-WAITING' ||
      step.stepstatus === 'ASYNC-WAITING'
    ) && !step.skip && step.steptype !== 'SUBWORKFLOW';
};

const skipIndexes = (order, stepid, value) => {
  var indexes = value.split(',');
  var steps = order.StepInstances.slice();

  indexes.forEach(i => {
    var ind = i;

    if (includes(i, '-')) {
      ind = i.split('-');
      var rng = range(ind[0], ind[1]);
      rng.push(ind[1]);

      rng.forEach(r => {
        steps.forEach((st, index) => {
          var skipped = st;

          if (st.stepid === stepid && st.ind === parseInt(r, 10) && canSkip(st)) {
            skipped.skip = true;
            steps[index] = skipped;
          }
        });
      });
    } else {
      steps.forEach((st, index) => {
        var skipped = st;

        if (st.stepid === stepid && st.ind === parseInt(ind, 10) && canSkip(st)) {
          skipped.skip = true;
          steps[index] = skipped;
        }
      });
    }
  });

  return steps;
};

module.exports = () => {
  const data = require('./data')();
  const router = new express.Router();

  router.get('/', (req, res) => {
    let filteredData;

    if (req.query.action && req.query.action === 'processingSummary') {
      const hours = [];
      filteredData = req.query.grouping === 'hourly' ?
        require('./summary/hourly/data')() : require('./summary/daily/data')();

      // Formats the data for the correct date
      filteredData = filteredData.map(p => {
        const modified = {};
        const sub = req.query.grouping === 'hourly' ? random(23) : random(90);
        const type = req.query.grouping === 'hourly' ? 'hours' : 'days';
        const format = req.query.grouping === 'hourly' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD';

        modified.grouping = moment().add(-sub, type).format(format);
        modified.minstarted = moment().add(-sub, type).format();
        modified.avgduration = random(5);
        modified.avgprocessing = random(5);
        modified.maxduration = random(500, 4000);
        modified.maxprocessing = random(5);
        modified.minduration = random(5);
        modified.minprocessing = random(5);

        return Object.assign({}, p, modified);
      });


      filteredData = filteredData.filter(d => moment(d.minstarted).isAfter(req.query.mindate));
    } else {
      filteredData = data;

      if (req.query.workflowid) {
        filteredData = filteredData.filter(o => (
          o.workflowid === parseInt(req.query.workflowid, 10)
        ));
      }

      if (req.query.date) {
        filteredData = filteredData.filter(o => (moment(req.query.date) <= moment(o.started)));
      }

      if (req.query.sort) {
        filteredData = filteredData.sort(
          firstBy((v1, v2) => {
            const prev = v1[req.query.sort];
            const cur = v2[req.query.sort];

            if (moment(prev).isValid() && moment(cur).isValid()) {
              return moment(prev).isBefore(cur) ? -1 : 1;
            }

            return prev.toLowerCase() < cur.toLowerCase() ? -1 : 1;
          }, -1)
        );
      }

      if (req.query.limit) {
        const start = parseInt(req.query.offset, 10) || 0;
        const end = parseInt(req.query.limit, 10);

        filteredData = filteredData.slice(start, start + end);
      }
    }

    res.json(filteredData);
  });

  router.get('/:id', (req, res) => {
    const item = data.find(s => findOrder(req.params.id, s));
    res.status(item ? 200 : 404).json(item);
  });

  router.put('/:id', (req, res) => {
    const order = data.find(o => findOrder(req.params.id, o));

    switch (req.body.action) {
      case 'cancel':
      case 'uncancel':
      case 'block':
      case 'unblock':
      case 'retry':
        order.workflowstatus = req.body.workflowstatus;
        break;
      case 'schedule':
        order.workflowstatus = req.body.workflowstatus;
        order.scheduled = req.body.date;
        break;
      case 'setPriority':
        order.priority = req.body.priority;
        break;
      case 'lock':
        Object.assign(order, lockOrder(order, req.body.note, req.body.username));
        break;
      case 'unlock':
        Object.assign(order, unlockOrder(order, req.body.note, req.body.username));
        break;
      case 'skipStep':
        const steps = skipIndexes(order, req.body.stepid, req.body.ind);

        order.StepInstances = steps;
        break;
      default:
        if (config.env !== 'test') {
          process.stderr.write(`Unknown action ${req.body.action}.\n`);
        }
        break;
    }

    res.json(order);
  });

  /**
   * Handles calling batch action
   * such as enable, disable, reset
   * etc
   */
  router.put('/', (req, res) => {
    const action = req.query.action;
    const ids = req.query.ids.split(',');
    let result = [];

    switch (action) {
      case 'block':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'BLOCKING';
          return item;
        });
        break;
      case 'retry':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'RETRYING';
          return item;
        });
        break;
      case 'cancel':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'CANCELING';
          return item;
        });
        break;
      case 'unblock':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'UNBLOCKING';
          return item;
        });
        break;
      case 'uncancel':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'UNCANCELING';
          return item;
        });
        break;
      default:
        break;
    }

    res.json(result);
  });

  router.post('/:id', (req, res) => {
    const order = data.find(o => findOrder(req.params.id, o));

    switch (req.body.action) {
      case 'notes':
        Object.assign(order, addNote(order, true, req.body.username, req.body.note));
        break;
      default:
        break;
    }

    res.json(order);
  });

  return router;
};
