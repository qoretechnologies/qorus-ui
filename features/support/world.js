import path from 'path';

import Browser from 'zombie';

import devConfig from '../../webpack.config/dev';


/**
 * Cucumber's World class.
 *
 * It connects Zombie browser instance to the test server and provides
 * useful utilities to work with the webapp.
 *
 * The test server must be already running. Its base URL is
 * constructed the same way development server starts listening for
 * HTTP requests webapp is started (by `HOST` and `PORT` environment
 * variables or their defaults).
 */
class World {
  /**
   * Initializes `zombie` browser and test server if needed.
   */
  constructor() {
    this.init = Promise.resolve().
      then(::this.setupBrowser).
      then(::this.setupChangeHooks);

    /**
     * Currently activate detail object.
     *
     * @type {{ id: number, name: string }}
     */
    this.detail = null;

    this.changed = Promise.reject(new Error('Not initialized'));
  }


  /**
   * Initializes `zombie` browser and visits the webapp index route.
   *
   * This can take some time if the test server is compliling all the
   * assets. There is a limit set to one minute.
   *
   * @return {Promise}
   */
  setupBrowser() {
    this.browser = new Browser();
    this.browser.site = `http://${devConfig().host}:${devConfig().port}`;

    this.noauth = false;

    const customHeaders = [
      { name: 'accept', value: 'application/json' },
      { name: 'content-type', value: 'application/json' },
    ];

    this.token = 'admin';

    this.browser.on('active', function setToken() {
      this.browser.window.localStorage.setItem('token', this.token);
    }.bind(this));

    const addCustomHeaders = (browser, request) => {
      if (this.token) {
        request.headers.set('Qorus-Token', this.token);
      }

      if (this.noauth) {
        request.headers.set('NoAuth', `${this.noauth}`);
      }

      if (request.method === 'POST') {
        customHeaders.forEach(headerInfo => {
          request.headers.set(headerInfo.name, headerInfo.value);
        });
      }
      return null;
    };

    this.browser.pipeline.addHandler(addCustomHeaders.bind(this));

    return new Promise((resolve, reject) => {
      this.browser.visit('/', '1m', err => {
        if (err) {
          reject(err);
          return;
        }

        this.changed = Promise.resolve();

        resolve();
      });
    });
  }


  /**
   * Initializes navigation listeners to anticipate changes.
   *
   * It is expected that the webapp dispatches events directly on
   * document to notify about changes.
   *
   * - WebappRouterUpdate: webapp route did change and and DOM changes
   *   are expected almost immediately (timeout 100 millisecond)
   * - WebappDomUpdate: confirms that DOM changes occured and do not
   *   wait for timeout (at least the first batch which should be
   *   enought)
   *
   * @see changes
   */
  //TODO This crazy thing seems to be necessary only due to an issue
  // with setting document title. A solution can be creating title
  // manager similar to modal manager where the last one to claim
  // control sets the title and no one else can. When someone returns
  // control back, previous claimer receives it.
  setupChangeHooks() {
    this.browser.document.addEventListener('WebappRouterUpdate', () => {
      this.changed = this.waitForChange(100);
    });
  }


  /**
   * Proxy to browser's own fetch method.
   *
   * @param {string} url
   * @param {Object} init
   * @return {!Promise<Object>}
   */
  fetch(url, init) {
    return this.browser.window.fetch(url, init);
  }


  /**
   * Calls given callback when the world is initialized.
   *
   * @param {function(*)} cb
   */
  whenReady(cb) {
    this.init.then(() => this.changed).then(cb, cb);
  }


  /**
   * Returns a promise representing ongoing changes on the page.
   *
   * Useful for `await` statements.
   *
   * @return {Promise}
   */
  changes() {
    return this.changed;
  }


  /**
   * Waits for browser changes do happen or for time to pass.
   *
   * @param {?number} limit
   * @return {Promise}
   */
  waitForChange(limit) {
    let timeoutId;

    function wait(resolve) {
      if (timeoutId) clearTimeout(timeoutId);
      this.browser.document.removeEventListener('WebappDomChange', wait);
      resolve();
    }

    return new Promise(resolve => {
      if (limit) timeoutId = setTimeout(wait.bind(this, resolve), limit);
      this.browser.document.addEventListener(
        'WebappDomChange', wait.bind(this, resolve)
      );
    });
  }

  /**
   * Waits for URL to change or 4 seconds to pass.
   *
   * @return {Promise}
   */
  waitForURLChange() {
    const url = this.browser.window.location.href;
    let limit = 1;

    return new Promise(resolve => {
      const int = setInterval(() => {
        if (this.browser.window.location.href !== url || limit === 4) {
          clearInterval(int);
          resolve();
        }

        limit = limit + 1;
      }, 1000);
    });
  }

  /**
   * Waits for element to appear.
   *
   * Checks if the selector (optionally in context) returns any
   * element over given limit by doing at most given number of checks.
   *
   * @param {string|!Element} selector
   * @param {(!Element|!Document)=} context
   * @param {number=} limit timeout in milliseconds (default: 5000)
   * @param {number=} checks number of tries (default: 10)
   * @return {Promise}
   */
  waitForElement(
    selector, context = this.browser.document, limit = 10000, checks = 50
  ) {
    function check(resolve, reject, tries = 0) {
      if (this.browser.query(selector, context)) {
        resolve();
        return;
      }

      if (tries + 1 >= checks) {
        reject(new Error(`Element "${selector}" not found in given time.`));
        return;
      }

      setTimeout(check.bind(this, resolve, reject, tries + 1), limit / checks);
    }

    return new Promise(check.bind(this));
  }

  keyUp = (target, key) => {
    const event = this.browser.window.document.createEvent('HTMLEvents');
    event.initEvent('keyup', true, true);
    event.which = key;
    const tr = this.browser.queryAll(target);
    tr && tr.dispatchEvent(event);
  }
}


module.exports = function world() {
  this.World = World;
};
