import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Footer from '../../src/js/components/footer';


describe("Footer from 'components/footer'", () => {
  it('displays schema, version and build if passed', () => {
    const info = {
      'omq-schema': 'test@test',
      'omq-version': '1',
      'omq-build': 'test',
    };

    const comp = TestUtils.renderIntoDocument(
      <Footer info={info} />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'small');

    expect(els[0].textContent).to.equal('(Schema: test@test)');
    expect(els[1].textContent).to.equal('(Version: 1.test)');
  });
});
