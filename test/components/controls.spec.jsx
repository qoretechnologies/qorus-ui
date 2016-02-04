import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { Control, Controls } from '../../src/js/components/controls';


describe("{ Control, Controls } from 'components/controls'", () => {
  before(() => {
    chai.use(spies);
  });


  describe('Control', () => {
    it('renders icon in button', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon="refresh" />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');


      expect(Array.from(el.classList)).to.include('btn');
      expect(Array.from(el.firstChild.classList)).to.include('fa');
      expect(Array.from(el.firstChild.classList)).to.include('fa-refresh');
    });


    it('applies button style', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon="refresh" btnStyle="primary" />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');


      expect(Array.from(el.classList)).to.include('btn-primary');
    });


    it('shows title as button title', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon="refresh" title="Restart" />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');


      expect(el.title).to.equal('Restart');
    });


    it('shows label as button text after the icon', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon="refresh" label="Restart" />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');


      expect(el.textContent).to.equal(' Restart');
    });


    it('handles action on click', () => {
      const action = chai.spy();
      const control = TestUtils.renderIntoDocument(
        <Control icon="refresh" action={action} />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');
      TestUtils.Simulate.click(el);


      expect(action).to.have.been.called();
    });
  });


  describe('Controls', () => {
    it('conveniently groups Control instances together', () => {
      const controls = TestUtils.renderIntoDocument(
        <Controls>
          <Control icon="power-off" />
          <Control icon="refresh" />
        </Controls>
      );


      const comps = TestUtils.scryRenderedComponentsWithType(controls, Control);


      expect(comps).to.have.length(2);
    });


    it('can override Control props via controls prop', () => {
      const controls = TestUtils.renderIntoDocument(
        <Controls controls={[{}, { icon: 'times' }]}>
          <Control icon="power-off" />
          <Control icon="refresh" />
        </Controls>
      );


      const comps = TestUtils.scryRenderedComponentsWithType(controls, Control);


      expect(comps[1].props.icon).to.equal('times');
    });


    it('applies Bootstrap btn-group when grouped', () => {
      const controls = TestUtils.renderIntoDocument(
        <Controls grouped>
          <Control icon="power-off" />
        </Controls>
      );


      TestUtils.findRenderedDOMComponentWithClass(controls, 'btn-group');
    });
  });
});
