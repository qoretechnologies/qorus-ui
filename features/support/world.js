import path from 'path';
import { fork } from 'child_process';

import Browser from 'zombie';


class World {
  constructor() {
    this.ready = Promise.resolve().
      then(::this.constructor.initializeServer).
      then(::this.initializeBrowser);
  }


  static initializeServer() {
    if (this.site) return Promise.resolve(this.site);

    this.server =
      fork(path.join(__dirname, '..', '..', 'server.js'));

    process.on('exit', () => this.server.kill());

    return new Promise(resolve => {
      this.server.once('message', url => {
        this.site = url;
        resolve();
      });
    });
  }


  initializeBrowser() {
    this.browser = new Browser();
    this.browser.site = this.constructor.site;

    return new Promise((resolve, reject) => {
      this.browser.visit('/', err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }


  whenReady(cb) {
    return this.ready.then(cb).catch(cb);
  }
}


module.exports = function world() {
  this.World = World;
};
