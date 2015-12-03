import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { Control, Controls } from '../../src/js/components/controls';


describe("* from 'components/controls'", () => {
  before(() => {
    chai.use(spies);
  });


  describe('Control', () => {
    it('renders icon in label', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon='refresh' />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'a');


      expect(Array.from(el.classList)).to.include('label');
      expect(Array.from(el.classList)).to.include('label-default');
      expect(Array.from(el.firstChild.classList)).to.include('fa');
      expect(Array.from(el.firstChild.classList)).to.include('fa-refresh');
    });


    it('applies label style', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon='refresh' labelStyle='primary' />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'a');


      expect(Array.from(el.classList)).to.include('label-primary');
      expect(Array.from(el.classList)).not.to.include('label-default');
    });


    it('applies title', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon='refresh' title='Restart' />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'a');


      expect(el.title).to.equal('Restart');
    });


    it('handles action on click', () => {
      const action = chai.spy();
      const control = TestUtils.renderIntoDocument(
        <Control icon='refresh' action={action} />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'a');
      TestUtils.Simulate.click(el);


      expect(action).to.have.been.called();
    });
  });


  describe('Controls', () => {
    it('conveniently groups Control instances together', () => {
      const controls = TestUtils.renderIntoDocument(
        <Controls>
          <Control icon='power-off' />
          <Control icon='refresh' />
        </Controls>
      );


      const comps = TestUtils.scryRenderedComponentsWithType(controls, Control);


      expect(comps).to.have.length(2);
    });


    it('can override Control props via controls prop', () => {
      const controls = TestUtils.renderIntoDocument(
        <Controls controls={[{}, { icon: 'times' }]}>
          <Control icon='power-off' />
          <Control icon='refresh' />
        </Controls>
      );


      const comps = TestUtils.scryRenderedComponentsWithType(controls, Control);


      expect(comps[1].props.icon).to.equal('times');
    });
  });
});
