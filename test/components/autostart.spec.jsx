import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import AutoStart from '../../src/js/components/autostart';


describe.only("AutoStart from 'components/autostart'", () => {
  before(() => {
    chai.use(spies);
  });

  it('displays autostart between _decrement and increment buttons', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart autostart={42} />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');

    expect(els[1].textContent.trim()).to.equal('42');
  });

  it('marks autostart if execCount is the same', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart autostart={42} execCount={42} />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');

    expect(Array.from(els[1].classList)).to.include('btn-success');
  });

  it('keeps implicit style autostart if execCount is different', () => {
    const comp = TestUtils.renderIntoDocument(
      <AutoStart autostart={42} execCount={41} />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');

    expect(Array.from(els[1].classList)).not.to.include('btn-default');
  });

  it('does not go to negative', () => {
    const dec = chai.spy();
    const comp = TestUtils.renderIntoDocument(
      <AutoStart autostart={0} onDecrementClick={dec} />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');
    TestUtils.Simulate.click(els[0]);

    expect(dec).to.have.not.been.called();
  });

  it('calls inc(context, autostart + 1) when plus button is clicked', () => {
    const inc = chai.spy();
    const comp = TestUtils.renderIntoDocument(
      <AutoStart autostart={0} onIncrementClick={inc} />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'button');
    TestUtils.Simulate.click(els[2]);

    expect(inc).to.have.been.called.with(1);
  });
});
