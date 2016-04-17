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
  if (query === undefined || query === '') return collection;

  const keysArray = typeof keys === 'string' ? [keys] : keys;
  const q = query.toString().split(' ').join('|');
  const regex = new RegExp(q, 'i');

  return collection.filter(c => {
    for (const k of keysArray) {
      if (regex.exec(c[k])) {
        return true;
      }
    }

    return false;
  });
};

export {
  findBy,
};
