import chai, { expect } from 'chai';
import spies from 'chai-spies';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Datepicker from '../../src/js/components/datepicker';
import Input from '../../src/js/components/datepicker/input';
import Calendar from '../../src/js/components/datepicker/calendar';
import Picker from '../../src/js/components/datepicker/picker';
import { mount } from 'enzyme';

import moment from 'moment';

describe("Datepicker, Input, Calendar from 'components/datepicker'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Datepicker', () => {
    it('renders the Datepicker input with default date', () => {
      const wrapper = mount(<Datepicker date="24h" />);
      const { inputDate } = wrapper.find('withHandlers(Input)').props();
      const date = moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');

      expect(inputDate).to.equal(date);
    });

    it('renders the Datepicker input with current date', () => {
      const wrapper = mount(<Datepicker date="now" />);
      const { inputDate } = wrapper.find('withHandlers(Input)').props();
      const date = moment().format('YYYY-MM-DD HH:mm:ss');

      expect(inputDate).to.equal(date);
    });

    it('renders the Datepicker input with the "all" date', () => {
      const wrapper = mount(<Datepicker date="all" />);
      const { inputDate } = wrapper.find('withHandlers(Input)').props();
      const date = moment('19700101000000').format('YYYY-MM-DD HH:mm:ss');

      expect(inputDate).to.equal(date);
    });

    it('renders the Datepicker input with provided date', () => {
      const wrapper = mount(<Datepicker date="19880809123456" />);
      const { inputDate } = wrapper.find('withHandlers(Input)').props();
      const date = '1988-08-09 12:34:56';

      expect(inputDate).to.equal(date);
    });

    it('renders the Datepicker without the selection buttons', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Datepicker
          futureOnly
          date="19880809123456"
        />
      );
      const result = renderer.getRenderOutput();

      expect(result.props.children).to.have.length(3);
      expect(result.props.children[1]).to.equal(null);
      expect(result.props.children[2]).to.equal(null);
    });
  });

  describe('Input', () => {
    it('runs the provided click action', () => {
      const action = chai.spy();
      const wrapper = mount(
        <Input onInputClick={action} />
      );
      wrapper.find('input').simulate('click');
      expect(action).to.have.been.called();
    });

    it('runs the provided change action', () => {
      const action = chai.spy();
      const wrapper = mount(
        <Input onInputChange={action} />
      );

      wrapper.find('input').simulate('change');
      expect(action).to.have.been.called();
    });

    it('runs the provided apply action on `enter` keypress', () => {
      const action = chai.spy();
      const wrapper = mount(
        <Input onApplyDate={action} />
      );
      wrapper.find('input').simulate('keyup', { keyCode: 13 });
      expect(action).to.have.been.called();
    });

    it('runs the provided blur action', () => {
      const action = chai.spy();
      const wrapper = mount(
        <Input
          applyOnBlur
          onApplyDate={action}
        />
      );

      wrapper.find('input').simulate('blur');
      expect(action).to.have.been.called();
    });

    it('has the correct id assigned', () => {
      const wrapper = mount(<Input id="test" />);
      expect(wrapper.find('#test').length).to.eql(1);
    });
  });

  describe('Picker', () => {
    it('renders the picker with the calendar', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Picker />
      );
      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('div');
      expect(result.props.className).to.equal('datepicker');
    });

    it('renders hour and minute inputs with the provided date data', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Picker
          hours="10"
          minutes="20"
        />
      );
      const result = renderer.getRenderOutput();

      expect(result.props.children[1].props.children.props.children[1].props.value).to.equal('10');
      expect(result.props.children[1].props.children.props.children[3].props.value).to.equal('20');
    });

    it('runs the provided functions', () => {
      const onAllClick = chai.spy();
      const on24hClick = chai.spy();
      const onResetClick = chai.spy();
      const onApplyClick = chai.spy();
      const onMinutesChange = chai.spy();
      const onHoursChange = chai.spy();
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Picker
          onAllClick={onAllClick}
          on24hClick={on24hClick}
          onResetClick={onResetClick}
          onApplyClick={onApplyClick}
          onMinutesChange={onMinutesChange}
          onHoursChange={onHoursChange}
        />
      );
      const result = renderer.getRenderOutput();

      result.props.children[2].props.children[0].props.action();
      result.props.children[2].props.children[1].props.action();
      result.props.children[1].props.children.props.children[4].props.children.props.action();
      result.props.children[3].props.onClick();
      result.props.children[1].props.children.props.children[3].props.onChange();
      result.props.children[1].props.children.props.children[1].props.onChange();

      expect(on24hClick).to.have.been.called();
      expect(onAllClick).to.have.been.called();
      expect(onResetClick).to.have.been.called();
      expect(onApplyClick).to.have.been.called();
      expect(onMinutesChange).to.have.been.called();
      expect(onHoursChange).to.have.been.called();
    });
  });

  describe('Calendar', () => {
    it('renders the calendar', () => {
      const date = moment();
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Calendar
          date={date}
          activeDate={date}
        />
      );
      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('table');
    });

    it('runs the provided functions', () => {
      const setDate = chai.spy();
      const setActiveDate = chai.spy();
      const date = moment();
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Calendar
          date={date}
          activeDate={date}
          setDate={setDate}
          setActiveDate={setActiveDate}
        />
      );
      const result = renderer.getRenderOutput();

      result.props.children[1].props.children[0].props.children[0].props.onClick();
      result.props.children[0].props.children[0].props.children[0].props.onClick();

      expect(setActiveDate).to.have.been.called();
      expect(setDate).to.have.been.called();
    });
  });
});
