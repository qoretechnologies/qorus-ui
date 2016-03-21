import path from 'path';
import { fork } from 'child_process';

import Browser from 'zombie';


/**
 * Cucumber's World class.
 *
 * If there is no test server already running indicated by `TEST_SITE`
 * environment variable, it launches a new one by forking project's
 * `server.js`.
 *
 * It connects `zombie` browser instance to the test server and
 * provides useful utilities to work with the webapp.
 */
class World {
  /**
   * Initializes `zombie` browser and test server if needed.
   */
  constructor() {
    this.init = Promise.resolve().
      then(::this.constructor.initializeServer).
      then(::this.initializeBrowser).
      then(::this.initializeChangeHooks);

    this.changed = Promise.reject(new Error('Not initialized'));
  }


  /**
   * Initializes test server if needed and promises it's URL.
   *
   * If test server is running, it returns immediately resolved
   * Promise with its URL.
   *
   * @return {Promise<string>}
   */
  static initializeServer() {
    if (!this.site && process.env.TEST_SITE) {
      this.site = process.env.TEST_SITE;
    }

    if (this.site) return Promise.resolve(this.site);

    this.server = fork(path.join(__dirname, '..', '..', 'server.js'));
    process.on('exit', () => this.server.kill());

    return new Promise(resolve => {
      this.server.once('message', url => {
        this.site = url;

        resolve(url);
      });
    });
  }


  /**
   * Initializes `zombie` browser and visits the webapp index route.
   *
   * This can take some time if the test server is compliling all the
   * assets. There is a limit set to one minute.
   *
   * @return {Promise}
   */
  initializeBrowser(site) {
    this.browser = new Browser();
    this.browser.site = site;

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
  initializeChangeHooks() {
    this.browser.document.addEventListener('WebappRouterUpdate', () => {
      this.changed = this.waitForChange(100);
    });
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
}


module.exports = function world() {
  this.World = World;
};
