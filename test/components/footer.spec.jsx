import React, { PropTypes, Component } from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Footer from '../../src/js/components/footer';

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

describe("Footer from 'components/footer'", () => {
  it('displays schema, version and build if passed', () => {
    const info = {
      'omq-schema': 'test@test',
      'omq-version': '1',
      'omq-build': 'test',
    };

    const wrapper = mount(
      <CompWithContext>
        <Footer info={info} />
      </CompWithContext>
    );

    const els = wrapper.find('small');

    expect(els.first().props().children).to.eql('(Schema: test@test)');
    expect(els.last().props().children.join('')).to.eql('(Version: 1.test)');
  });
});
