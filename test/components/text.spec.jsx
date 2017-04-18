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


describe.only('Text from "component/text"', () => {
  it('renders the text', () => {
    const wrapper = mount(
      <CompWithContext>
        <Text text="Hello" />
      </CompWithContext>
    );

    expect(wrapper.find('p').length).to.eql(1);
    expect(wrapper.find('p').first().text()).to.eql('Hello');
  });

  it('renders the placeholder', () => {
    const wrapper = mount(
      <CompWithContext>
        <Text placeholder="Display this" text="Hello" />
      </CompWithContext>
    );

    expect(wrapper.find('p').length).to.eql(1);
    expect(wrapper.find('p').first().text()).to.eql('Display this');
  });

  it('shows a modal when the text is clicked', () => {
    const action = chai.spy();
    const wrapper = mount(
      <CompWithContext openModal={action}>
        <Text
          popup
          text="Hello"
        />
      </CompWithContext>
    );

    wrapper.find('p').first().simulate('click');

    expect(action).to.have.been.called();
  });

  it('stringifies objects', () => {
    const wrapper = mount(
      <CompWithContext>
        <Text
          text={{
            hello: "it's me",
          }}
        />
      </CompWithContext>
    );

    expect(wrapper.find('p').first().text()).to.eql('{"hello":"it\'s me"}');
  });

  it('does not show a modul when noPopup prop passed, instead changes to div, and back', () => {
    const action = chai.spy();
    const wrapper = mount(
      <CompWithContext openModal={action}>
        <Text text="Hello" />
      </CompWithContext>
    );

    wrapper.find('p').first().simulate('click');

    expect(action).to.have.not.been.called();
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('p')).to.have.length(0);

    wrapper.find('div').first().simulate('click');

    expect(wrapper.find('p')).to.have.length(1);
    expect(wrapper.find('div')).to.have.length(0);
  });
});
