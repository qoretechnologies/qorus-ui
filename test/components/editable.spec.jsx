import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Editable from '../../src/js/components/editable';

describe("Editable from 'components/editable'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Date', () => {
    it('renders the header with the provided text prop', () => {
      const wrapper = mount(
        <Editable text="Hello" />
      );

      expect(wrapper.find('h3').length).to.equal(1);
      expect(wrapper.find('h3').text()).to.equal('Hello');
    });

    it('renders an input with 2 buttons and the text when the header is clicked', () => {
      const wrapper = mount(
        <Editable
          text="Hello"
          value="Another hello"
        />
      );

      wrapper.find('h3').simulate('click');

      expect(wrapper.find('form').length).to.equal(1);
      expect(wrapper.find('input').length).to.equal(1);
      expect(wrapper.find('button').length).to.equal(2);
    });

    it('renders an input with the provided type', () => {
      const wrapper = mount(
        <Editable
          text="Hello"
          value="2"
          type="number"
        />
      );

      wrapper.find('h3').simulate('click');

      expect(wrapper.find('input[type="number"]').length).to.equal(1);
    });

    it('renders the text again when cancel is clicked', () => {
      const wrapper = mount(
        <Editable
          text="Hello"
          value="Hello"
        />
      );

      wrapper.find('h3').simulate('click');
      wrapper.find('button').last().simulate('click');

      expect(wrapper.find('h3').length).to.equal(1);
    });

    it('runs the provided function when submitted', () => {
      const action = chai.spy();
      const wrapper = mount(
        <Editable
          text="Hello"
          value="Hello"
          onSubmit={action}
        />
      );

      wrapper.find('h3').simulate('click');
      wrapper.find('input').simulate('change', { target: { value: 'Its me' } });
      wrapper.find('form').simulate('submit');

      expect(action).to.have.been.called().with('Its me');
    });

    it('doesnt run the provided function when the error checker fails', () => {
      const action = chai.spy();
      const errorChecker = (value) => value < 10;
      const wrapper = mount(
        <Editable
          text="Hello"
          value="Hello"
          onSubmit={action}
          errorChecker={errorChecker}
        />
      );

      wrapper.find('h3').simulate('click');
      wrapper.find('input').simulate('change', { target: { value: 11 } });
      wrapper.find('form').simulate('submit');

      expect(action).to.have.not.been.called();
      expect(wrapper.find('input').first().hasClass('form-error')).to.equal(true);
    });

    it('runs the provided function when the error checker succeeds', () => {
      const action = chai.spy();
      const errorChecker = (value) => value < 10;
      const wrapper = mount(
        <Editable
          text="Hello"
          value="Hello"
          onSubmit={action}
          errorChecker={errorChecker}
        />
      );

      wrapper.find('h3').simulate('click');
      wrapper.find('input').simulate('change', { target: { value: 5 } });
      wrapper.find('form').simulate('submit');

      expect(action).to.have.been.called().with(5);
    });
  });
});
