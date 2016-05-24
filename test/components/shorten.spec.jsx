import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Shorten from '../../src/js/components/shorten';

describe("Shorten from 'components/shorten'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Shorten', () => {
    it('renders div element without tooltip', () => {
      const comp = TestUtils.renderIntoDocument(
        <Shorten>
          This should not be shortened, because parent doesn't have limit for div.
        </Shorten>
      );

      const renderedDOM = () => ReactDOM.findDOMNode(comp);

      expect(renderedDOM().getAttribute('data-tooltip')).to.equal(null);
    });
  });
});
