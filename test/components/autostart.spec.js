import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import AutoStart from '../../src/js/components/autostart';


describe("AutoStart from 'components/autostart'", () => {
  before(() => {
    chai.use(spies);
  });

  it('displays autostart between decrement and increment buttons', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart context={ 7 } autostart={ 42 } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');

    expect(els[1].textContent.trim()).to.equal('42');
  });

  it('marks autostart if execCount is the same', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart context={ 7 } autostart={ 42 } execCount={ 42 } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');

    expect(els[1].className.split(/\s+/g)).
      to.include('btn-success');
  });

  it('keeps default style autostart if execCount is different', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart context={ 7 } autostart={ 42 } execCount={ 41 } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');

    expect(els[1].className.split(/\s+/g)).
      to.include('btn-default');
  });

  it('calls dec(context, autostart - 1) when minus button is clicked', () => {
    const dec = chai.spy();
    const comp = TestUtils.renderIntoDocument(
      <AutoStart context={ 7 } dec={ dec } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');
    TestUtils.Simulate.click(els[0]);

    expect(dec).to.have.been.called.with(7, -1);
  });

  it('calls inc(context, autostart + 1) when plus button is clicked', () => {
    const inc = chai.spy();
    const comp = TestUtils.renderIntoDocument(
      <AutoStart context={ 7 } inc={ inc } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');
    TestUtils.Simulate.click(els[2]);

    expect(inc).to.have.been.called.with(7, 1);
  });
});
