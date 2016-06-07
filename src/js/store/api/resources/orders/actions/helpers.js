const moment = require('moment');

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

module.exports.lockOrder = lockOrder;
module.exports.unlockOrder = unlockOrder;
module.exports.addNote = addNote;
