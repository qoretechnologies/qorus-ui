import React, { PropTypes, Component } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Text from '../../src/js/components/text';

chai.use(spies);

class CompWithContext extends Component {
  static childContextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  props: {
    children?: any,
    openModal: Function,
  };

  getChildContext() {
    return {
      openModal: this.props.openModal,
      closeModal: () => true,
    };
  }

  render() {
    return this.props.children;
  }
}


describe('Text from "component/text"', () => {
  it('renders the text', () => {
    const wrapper = mount(
      <CompWithContext>
        <Text text="Hello" />
      </CompWithContext>
    );

    expect(wrapper.find('p').length).to.eql(1);
    expect(wrapper.find('p').first().text()).to.eql('Hello');
  });

  it('shows a modal when the text is clicked', () => {
    const action = chai.spy();
    const wrapper = mount(
      <CompWithContext openModal={action}>
        <Text text="Hello" />
      </CompWithContext>
    );

    wrapper.find('p').first().simulate('click');

    expect(action).to.have.been.called();
  });

  it('does not show a modul when noPopup prop passed', () => {
    const action = chai.spy();
    const wrapper = mount(
      <CompWithContext openModal={action}>
        <Text text="Hello" noPopup />
      </CompWithContext>
    );

    wrapper.find('p').first().simulate('click');

    expect(action).to.have.not.been.called();
  });
});