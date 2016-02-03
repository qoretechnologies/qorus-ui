import { jsdom } from 'jsdom';


/**
 * Sets-up DOM on given context object if not present already.
 *
 * @param {object} ctx
 */
function missingGlobal(ctx) {
  const global = {};

  if (!ctx.document) {
    global.document = jsdom(
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
    global.window = global.document.defaultView;
    global.self = global.window.self;
  }

  if (!ctx.navigator) {
    global.navigator = {
      userAgent: `Node.js (${process.platform}; U; rv:${process.version})`
    };
  }

  return global;
}


if (typeof global !== 'undefined') {
  Object.assign(global, missingGlobal(global));
}
