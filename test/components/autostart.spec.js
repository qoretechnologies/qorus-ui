require('../testdom.js')('<html><body></body></html>');

import jsdom from 'mocha-jsdom';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import React from 'react';

import AutoStart from '../../src/js/components/autostart';


// XXX Discuss this style as it is definitely different from other specs.
describe("AutoStart from 'components/autostart'", () => {
  jsdom({ skipWindowCheck: true });

  let TestUtils;

  before(() => {
    TestUtils = React.addons.TestUtils;
    chai.use(spies);
  });

  it('displays autostart between decrement and increment buttons', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart id={ 7 } autostart={ 42 } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

    expect(els[1].getDOMNode().textContent.trim()).to.equal('42');
  });

  it('marks autostart if execCount is the same', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart id={ 7 } autostart={ 42 } execCount={ 42 } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

    expect(els[1].getDOMNode().className.split(/\s+/g)).
      to.include('label-success');
  });

  it('keeps default style autostart if execCount is different', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart id={ 7 } autostart={ 42 } execCount={ 41 } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

    expect(els[1].getDOMNode().className.split(/\s+/g)).
      to.include('label-default');
  });

  it('calls dec(id, autostart - 1) when minus button is clicked', () => {
    const dec = chai.spy();
    const comp = TestUtils.renderIntoDocument(
      <AutoStart id={ 7 } dec={ dec } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');
    TestUtils.Simulate.click(els[0]);

    expect(dec).to.have.been.called.with(7, -1);
  });

  it('calls inc(id, autostart + 1) when plus button is clicked', () => {
    const inc = chai.spy();
    const comp = TestUtils.renderIntoDocument(
      <AutoStart id={ 7 } inc={ inc } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');
    TestUtils.Simulate.click(els[2]);

    expect(inc).to.have.been.called.with(7, 1);
  });

});
