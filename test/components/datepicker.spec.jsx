import chai, { expect } from 'chai';
import spies from 'chai-spies';
import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';

import Datepicker from '../../src/js/components/datepicker';
import Input from '../../src/js/components/datepicker/input';
import Calendar from '../../src/js/components/datepicker/calendar';
import Picker from '../../src/js/components/datepicker/picker';

describe("Datepicker, Input, Calendar from 'components/datepicker'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Datepicker', () => {
    it('renders the Datepicker input with default date', () => {
      const wrapper = mount(<Datepicker date="24h" />);
      const { value } = wrapper.find('input').props();
      const date = moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');

      expect(value).to.equal(date);
    });

    it('renders the Datepicker input with week date', () => {
      const wrapper = mount(<Datepicker date="week" />);
      const { value } = wrapper.find('input').props();
      const date = moment().add(-1, 'weeks').format('YYYY-MM-DD HH:mm:ss');

      expect(value).to.equal(date);
    });

    it('renders the Datepicker input with month date', () => {
      const wrapper = mount(<Datepicker date="month" />);
      const { value } = wrapper.find('input').props();
      const date = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');

      expect(value).to.equal(date);
    });

    it('renders the Datepicker input with 30 days date', () => {
      const wrapper = mount(<Datepicker date="thirty" />);
      const { value } = wrapper.find('input').props();
      const date = moment().add(-30, 'days').format('YYYY-MM-DD HH:mm:ss');

      expect(value).to.equal(date);
    });

    it('renders the Datepicker input with the "all" date', () => {
      const wrapper = mount(<Datepicker date="all" />);
      const { value } = wrapper.find('input').props();
      const date = moment('19700101').format('YYYY-MM-DD HH:mm:ss');

      expect(value).to.equal(date);
    });

    it('renders the Datepicker input with provided date', () => {
      const wrapper = mount(<Datepicker date="19880809123456" />);
      const { value } = wrapper.find('input').props();
      const date = '1988-08-09 12:34:56';

      expect(value).to.equal(date);
    });

    it('renders the Datepicker without the selection buttons', () => {
      const wrapper = mount(
        <Datepicker
          futureOnly
          date="19880809123456"
        />
      );

      expect(wrapper.find('button')).to.have.length(0);
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
      const wrapper = mount(
        <Picker />
      );

      expect(wrapper.find('div').first().hasClass('datepicker')).to.eq(true);
    });

    it('renders hour and minute inputs with the provided date data', () => {
      const wrapper = mount(
        <Picker
          hours="10"
          minutes="20"
        />
      );

      expect(wrapper.find('input').first().props().value).to.equal('10');
      expect(wrapper.find('input').last().props().value).to.equal('20');
    });

    it('runs the provided functions', () => {
      const onAllClick = chai.spy();
      const on24hClick = chai.spy();
      const onResetClick = chai.spy();
      const onApplyClick = chai.spy();
      const onMinutesChange = chai.spy();
      const onHoursChange = chai.spy();
      const wrapper = mount(
        <Picker
          onAllClick={onAllClick}
          on24hClick={on24hClick}
          onResetClick={onResetClick}
          onApplyClick={onApplyClick}
          onMinutesChange={onMinutesChange}
          onHoursChange={onHoursChange}
        />
      );

      // Reset
      wrapper.find('.btn-xs').first().simulate('click');
      // 24h
      wrapper.find('.btn-xs').at(1).simulate('click');
      // All
      wrapper.find('.btn-xs').at(2).simulate('click');
      // Apply
      wrapper.find('.btn-xs').last().simulate('click');


      expect(on24hClick).to.have.been.called();
      expect(onAllClick).to.have.been.called();
      expect(onResetClick).to.have.been.called();
      expect(onApplyClick).to.have.been.called();
    });
  });

  describe('Calendar', () => {
    it('renders the calendar', () => {
      const date = moment();
      const wrapper = mount(
        <Calendar
          date={date}
          activeDate={date}
        />
      );

      expect(wrapper.name()).to.equal('onlyUpdateForKeys(Calendar)');
      expect(wrapper.find('table')).to.have.length(1);
    });

    it('runs the provided functions', () => {
      const setDate = chai.spy();
      const setActiveDate = chai.spy();
      const date = moment();
      const wrapper = mount(
        <Calendar
          date={date}
          activeDate={date}
          setDate={setDate}
          setActiveDate={setActiveDate}
        />
      );

      wrapper.find('td').first().simulate('click');
      wrapper.find('th').first().simulate('click');

      expect(setActiveDate).to.have.been.called();
      expect(setDate).to.have.been.called();
    });
  });
});
