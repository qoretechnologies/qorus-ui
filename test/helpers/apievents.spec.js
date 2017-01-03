import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { pipeline } from '../../src/js/helpers/apievents';

chai.use(spies);

describe('pipeline from helpers/apievents', () => {
  it('runs the action after 200ms if a single event is passed', (done) => {
    const dispatch = chai.spy();
    const action = chai.spy();

    pipeline(
      'testing',
      action,
      { id: 1 },
      dispatch
    );

    setTimeout(() => {
      expect(dispatch).to.have.been.called();
      expect(action).to.have.been.called().with([{ id: 1 }]);
      done();
    }, 250);
  });

  it('runs the action after maximum of 2000ms events are constatnly coming', function (done) {
    this.timeout(3000);

    const dispatch = chai.spy();
    const action = chai.spy();
    let cnt = 1;

    const int = setInterval(() => {
      pipeline(
        'testing',
        action,
        { id: cnt },
        dispatch
      );

      cnt = cnt + 1;
    }, 50);

    setTimeout(() => {
      clearInterval(int);
      expect(dispatch).to.have.been.called();
      done();
    }, 2500);
  });
});
