const moment = require('moment');

const lockOrder = (order, note, username) => (
  {
    operator_lock: username,
    note_count: order.note_count + 1,
    notes: order.notes.slice().concat({
      saved: true,
      username,
      note: `ORDER LOCK: ${note}`,
      created: moment().format(),
      modified: moment().format(),
    }),
  }
);

const unlockOrder = (order, note, username) => (
  {
    operator_lock: null,
    note_count: order.note_count + 1,
    notes: order.notes.slice().concat({
      saved: true,
      username,
      note: `ORDER LOCK: ${note}`,
      created: moment().format(),
      modified: moment().format(),
    }),
  }
);

module.exports.lockOrder = lockOrder;
module.exports.unlockOrder = unlockOrder;
