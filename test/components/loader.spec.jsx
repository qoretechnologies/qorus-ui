import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Loader from '../../src/js/components/loader';


describe("Loader from 'components/loader'", () => {
  it('renders text "Loading" with a spinner next to it', () => {
    const comp = TestUtils.renderIntoDocument(
      <Loader />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'p');

    expect(el.textContent).to.equal(' Loading');
    expect(Array.from(el.firstElementChild.classList)).
      to.have.members(['fa', 'fa-spinner', 'fa-spin']);
  });
});
