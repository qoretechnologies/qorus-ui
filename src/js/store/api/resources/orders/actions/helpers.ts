// @ts-ignore ts-migrate(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
const moment = require('moment');
const range = require('lodash').range;
const includes = require('lodash').includes;
const canSkip = require('../../../../../helpers/orders').canSkip;

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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'operator_lock' does not exist on type '{... Remove this comment to see the full error message
  obj.operator_lock = username;

  return obj;
};

const unlockOrder = (order, note, username) => {
  const obj = addNote(order, true, username, note);
  // @ts-ignore ts-migrate(2339) FIXME: Property 'operator_lock' does not exist on type '{... Remove this comment to see the full error message
  obj.operator_lock = null;

  return obj;
};

const skipIndexes = (order, stepid, value) => {
  const indexes = value.toString().split(',');
  const steps = order.StepInstances.slice();

  indexes.forEach((i) => {
    let ind = i;

    if (includes(i, '-')) {
      ind = i.split('-');
      const rng = range(ind[0], ind[1]);
      rng.push(ind[1]);

      rng.forEach((r) => {
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

module.exports.lockOrder = lockOrder;
module.exports.unlockOrder = unlockOrder;
module.exports.addNote = addNote;
module.exports.skipIndexes = skipIndexes;
