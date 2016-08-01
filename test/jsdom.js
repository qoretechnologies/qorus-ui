import { jsdom } from 'jsdom';


/**
 * Sets-up DOM on given context object if not present already.
 *
 * @param {object} ctx
 */
function missingGlobal(ctx) {
  const global = {};
  const storage = {};

  const localStorage = {
    setItem(key, value) {
      storage[key] = value;
    },

    getItem(key) {
      return storage[key];
    },

    deleteItem(key) {
      storage[key] = undefined;
    },
  };

  if (!ctx.document) {
    var doc = jsdom(
      '<!DOCTYPE html>' +
      '<html>' +
        '<head>' +
          '<meta charset="utf-8">' +
        '</head>' +
        '<body>' +
        '</body>' +
      '</html>',
      { url: 'http://qorus.example.com/' }
    );
    global.window = doc.defaultView;
    global.document = global.window.document;
    global.window.localStorage = localStorage;
    global.self = global.window.self;
    global.localStorage = localStorage;
  }

  if (!ctx.navigator) {
    global.navigator = {
      userAgent: `Node.js (${process.platform}; U; rv:${process.version})`,
    };
  }

  return global;
}


if (typeof global !== 'undefined') {
  Object.assign(global, missingGlobal(global));
}
