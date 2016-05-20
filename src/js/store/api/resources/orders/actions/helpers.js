const moment = require('moment');

const lockOrder = (order, note, username) => {
  let notes;

  if (!order.notes) {
    notes = [{
      saved: true,
      username,
      note: `ORDER LOCK: ${note}`,
      created: moment().format(),
      modified: moment().format(),
    }];
  } else {
    notes = order.notes.slice().concat({
      saved: true,
      username,
      note: `ORDER LOCK: ${note}`,
      created: moment().format(),
      modified: moment().format(),
    });
  }

  return {
    operator_lock: username,
    note_count: order.note_count + 1,
    notes,
  };
};

const unlockOrder = (order, note, username) => {
  let notes;

  if (!order.notes) {
    notes = [{
      saved: true,
      username,
      note: `ORDER LOCK: ${note}`,
      created: moment().format(),
      modified: moment().format(),
    }];
  } else {
    notes = order.notes.slice().concat({
      saved: true,
      username,
      note: `ORDER LOCK: ${note}`,
      created: moment().format(),
      modified: moment().format(),
    });
  }

  return {
    operator_lock: null,
    note_count: order.note_count + 1,
    notes,
  };
};

module.exports.lockOrder = lockOrder;
module.exports.unlockOrder = unlockOrder;
