/**
 * Searches through an array collection with key/value
 * objects and returns filtered data
 *
 * @param {String|Array} keys
 * @param {String} query
 * @param {Array} collection
 * @returns {Array}
 */
const findBy = (keys, query, collection) => {
  if (query === undefined || query === '' || query === null) return collection;

  let keysArray;
  let q;

  // Check if colon is present, means to search by a certain key!
  if (query.indexOf(':') !== -1) {
    const qSplit = query.split(':');
    keysArray = [qSplit[0]];
    q = qSplit[1]
      .toString()
      .split(' ')
      .join('|');
  } else {
    keysArray = typeof keys === 'string' ? [keys] : keys;
    q = query
      .toString()
      .split(' ')
      .join('|');
  }

  const regex = new RegExp(q, 'i');

  return collection.filter(c => {
    for (const k of keysArray) {
      //* Stringify objects to be searchable
      const value = typeof c[k] === 'object' ? JSON.stringify(c[k]) : c[k];

      if (regex.exec(value)) {
        return true;
      }
    }

    return false;
  });
};

export { findBy };
