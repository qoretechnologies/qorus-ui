import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Footer from '../../src/js/components/footer.js';


describe('Testing Footer Component', function () {
  const props = {
    info: {
      'omq-schema': 'test@test',
      'omq-version': '1',
      'omq-build': 'test'
    }
  };

  const testComponent = TestUtils.renderIntoDocument(
    <Footer {...props} />
  );

  const el = TestUtils.scryRenderedDOMComponentsWithTag(testComponent, 'small');

  it('<small> schema should be (Schema: test@test)', function () {
    expect(el[0].textContent).to.equal('(Schema: test@test)');
  });

  it('<small> version should be 1.test', function () {
    expect(el[1].textContent).to.equal('(Version: 1.test)');
  });
});
