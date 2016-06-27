const moment = require('moment');
const range = require('lodash').range;
const includes = require('lodash').includes;
const canSkip = require('helpers/orders').canSkip;

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

module.exports.lockOrder = lockOrder;
module.exports.unlockOrder = unlockOrder;
module.exports.addNote = addNote;
module.exports.skipIndexes = skipIndexes;
