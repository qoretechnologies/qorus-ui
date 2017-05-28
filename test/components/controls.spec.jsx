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
      const control = mount(
        <Control icon="refresh" />
      );

      expect(control.find('button')).to.have.length(1);
      expect(control.find('i').hasClass('fa')).to.eql(true);
      expect(control.find('i').hasClass('fa-refresh')).to.eql(true);
    });


    it('applies button style', () => {
      const control = mount(
        <Control icon="refresh" btnStyle="primary" />
      );

      expect(control.find('button').hasClass('btn-primary')).to.eql(true);
    });


    it('shows title as button title', () => {
      const control = mount(
        <Control icon="refresh" title="Restart" />
      );

      expect(control.getDOMNode()).to.have.property('title');
    });


    it('shows label as button text after the icon', () => {
      const control = mount(
        <Control icon="refresh" label="Restart" />
      );

      expect(control.find('button').text()).to.equal(' Restart');
    });


    it('handles action on click', () => {
      const action = chai.spy();
      const control = mount(
        <Control icon="refresh" action={action} />
      );

      control.find('button').simulate('click');

      expect(action).to.have.been.called();
    });

    it('set disabled button', () => {
      const control = mount(
        <Control icon="refresh" disabled />
      );

      expect(control.getDOMNode()).to.have.property('disabled');
    });
  });


  describe('Controls', () => {
    it('conveniently groups Control instances together', () => {
      const controls = mount(
        <Controls>
          <Control icon="power-off" />
          <Control icon="refresh" />
        </Controls>
      );

      expect(controls.find('button')).to.have.length(2);
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
