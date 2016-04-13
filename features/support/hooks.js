import path from 'path';
import fs from 'fs';


module.exports = function hooks() {
  this.Before({ timeout: 10 * 1000 }, function reloadMockApi(scenario, cb) {
    fs.readFile(
      path.resolve(__dirname, '..', '..', process.env.PIDFILE),
      'ascii',
      (err, pid) => {
        if (err) {
          cb(err);
          return;
        }

        process.kill(parseInt(pid, 10), 'SIGUSR2');
        setTimeout(cb, 100);
      }
    );
  });

  this.Before({ timeout: 60 * 1000 }, function waitForWorldInit(scenario, cb) {
    this.whenReady(cb);
  });
};
