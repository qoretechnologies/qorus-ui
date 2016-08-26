import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { mount } from 'enzyme';
import dirtyChai from 'dirty-chai';

import { Control, Controls, CondControl } from '../../src/js/components/controls';

chai.use(dirtyChai);

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

    it('set disabled button', () => {
      const control = TestUtils.renderIntoDocument(
        <Control icon="refresh" disabled />
      );


      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');


      expect(el.disabled).to.be.true();
    });

    it('sets the buttons type', () => {
      const control = TestUtils.renderIntoDocument(
        <Control type="submit" />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');

      expect(el.type).to.equal('submit');
    });

    it('sets the buttons style', () => {
      const control = TestUtils.renderIntoDocument(
        <Control css={{ color: '#fff' }} />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');

      expect(el.style.color).to.equal('rgb(255, 255, 255)');
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

  describe('ConditionControl', () => {
    it('shows the control if condition passed', () => {
      const cond = () => true;
      const Comp = (
        <CondControl
          condition={cond}
          label="Test"
        />
      );

      const wrapper = mount(Comp);

      expect(wrapper.find('button').length).to.eql(1);
      expect(wrapper.find('button').text()).to.eql(' Test');
    });

    it('does not show the control if condition failed', () => {
      const cond = () => false;
      const Comp = (
        <CondControl
          condition={cond}
        />
      );

      const wrapper = mount(Comp);

      expect(wrapper.find('button').length).to.eql(0);
    });

    it('runs the provided onClick function', () => {
      const cond = () => true;
      const onClick = chai.spy();
      const Comp = (
        <CondControl
          condition={cond}
          onClick={onClick}
        />
      );

      const wrapper = mount(Comp);

      wrapper.find('button').simulate('click');

      expect(onClick).to.have.been.called();
    });
  });
});
