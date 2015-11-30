import { jsdom } from 'jsdom';


/**
 * Sets-up DOM on given context object if not present already.
 *
 * @param {object} ctx
 */
function ensureDom(ctx) {
  if (!ctx.document) {
    ctx.document = jsdom(
      '<!DOCTYPE html>' +
      '<html>' +
        '<head>' +
          "<meta charset='utf-8'>" +
        '</head>' +
        '<body>' +
        '</body>' +
      '</html>'
    );
  }

  if (!ctx.window) {
    ctx.window = ctx.document.defaultView;
  }

  if (!ctx.navigator) {
    ctx.navigator = {
      userAgent: `Node.js (${process.platform}; U; rv:${process.version})`
    };
  }
}


if (typeof global !== 'undefined') ensureDom(global);
