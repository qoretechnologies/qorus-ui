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
const values = require('lodash').values;
const range = require('lodash').range;

const addNote = (order, saved, username, note) => {
  let notes;
  const data = {
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
  const obj = addNote(order, true, username, note);
  obj.operator_lock = username;

  return obj;
};

const unlockOrder = (order, note, username) => {
  const obj = addNote(order, true, username, note);
  obj.operator_lock = null;

  return obj;
};

const canSkip = (step) => (
      step.stepstatus === 'RETRY' ||
      step.stepstatus === 'ERROR' ||
      step.stepstatus === 'EVENT-WAITING' ||
      step.stepstatus === 'ASYNC-WAITING'
    ) && !step.skip && step.steptype !== 'SUBWORKFLOW';

const skipIndexes = (order, stepid, value) => {
  const indexes = value.split(',');
  const steps = order.StepInstances.slice();

  indexes.forEach(i => {
    let ind = i;

    if (includes(i, '-')) {
      ind = i.split('-');
      const rng = range(ind[0], ind[1]);
      rng.push(ind[1]);

      rng.forEach(r => {
        steps.forEach((st, index) => {
          const skipped = st;

          if (st.stepid === stepid && st.ind === parseInt(r, 10) && canSkip(st)) {
            skipped.skip = true;
            steps[index] = skipped;
          }
        });
      });
    } else {
      steps.forEach((st, index) => {
        const skipped = st;

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

      if (req.query.global === 'true' && filteredData.length) {
        const addValues = (v1, v2) => parseInt(v1, 10) + parseInt(v2, 10);

        filteredData = [filteredData.reduce((result, cur) => {
          if (!result) return cur;

          const copy = result;
          copy.avgduration = addValues(copy.avgduration, cur.avgduration);
          copy.avgprocessing = addValues(copy.avgprocessing, cur.avgprocessing);
          copy.minduration = addValues(copy.minduration, cur.minduration);
          copy.minprocessing = addValues(copy.minprocessing, cur.minprocessing);
          copy.maxduration = addValues(copy.maxduration, cur.maxduration);
          copy.maxprocessing = addValues(copy.maxprocessing, cur.maxprocessing);

          return copy;
        })];
      }
    } else {
      filteredData = data;

      if (req.query.workflowid) {
        filteredData = filteredData.filter(o => (
          o.workflowid === parseInt(req.query.workflowid, 10)
        ));
      }

      if (req.query.ids) {
        const ids = req.query.ids.split(',');

        filteredData = filteredData.filter(o => includes(ids, o.workflow_instanceid.toString()));
      }

      if (req.query.keyvalue) {
        filteredData = filteredData.filter(o => {
          const val = o.keys ? values(o.keys) : [];
          const result = val.filter(v => includes(v, req.query.keyvalue));


          return result.length;
        });
      }

      if (req.query.keyname) {
        filteredData = filteredData.filter(o => {
          const val = o.keys ? Object.keys(o.keys) : [];
          const result = val.filter(v => includes(v, req.query.keyname));


          return result.length;
        });
      }

      if (req.query.date) {
        filteredData = filteredData.filter(o => moment(o.modified).isAfter(
          moment(req.query.date, 'YYYY-MM-DD HH:mm:ss').format()
        ));
      }

      if (req.query.maxmodified) {
        filteredData = filteredData.filter(o => moment(o.modified).isBefore(
          moment(req.query.maxmodified, 'YYYY-MM-DD HH:mm:ss').format()
        ));
      }

      if (req.query.status) {
        const statuses = req.query.status.split(',');

        filteredData = filteredData.filter(o => includes(statuses, o.workflowstatus));
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

  router.get('/:id/StepInstances', (req, res) => {
    res.json([]);
  });

  router.put('/:id', (req, res) => {
    const order = data.find(o => findOrder(req.params.id, o));
    let steps;

    switch (req.query.action) {
      case 'cancel':
      case 'uncancel':
      case 'block':
      case 'unblock':
      case 'retry':
        order.workflowstatus = req.query.action.toUpperCase();
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
        steps = skipIndexes(order, req.body.stepid, req.body.ind);

        order.StepInstances = steps;
        break;
      default:
        if (config.env !== 'test') {
          process.stderr.write(`Unknown action ${req.body.action}.\n`);
        }
        break;
    }

    setTimeout(() => {
      if (req.params.id === '4000') {
        res.status(409).json({ err: true, desc: 'There was an error' });
      } else {
        res.json('OK');
      }
    }, 1000);
  });

  /**
   * Handles calling batch action
   * such as enable, disable, reset
   * etc
   */
  router.put('/', (req, res) => {
    const action = req.query.action;
    const ids = req.query.ids.split(',');

    switch (action) {
      case 'block':
        ids.forEach(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'BLOCKING';
        });
        break;
      case 'retry':
        ids.forEach(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'RETRYING';
        });
        break;
      case 'cancel':
        ids.forEach(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'CANCELING';
        });
        break;
      case 'unblock':
        ids.forEach(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'UNBLOCKING';
        });
        break;
      case 'uncancel':
        ids.forEach(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'UNCANCELING';
        });
        break;
      default:
        break;
    }

    const retrn = {};

    ids.forEach(id => {
      retrn[id] = parseInt(id, 10) === 4000 ? 'Error: there was an error' : { success: true };
    });

    res.json(retrn);
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
