/* eslint no-unused-expressions: 0 */
/* @flow */
import React, { PropTypes, Component } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import qs from 'qs';

import Pane from '../../src/js/components/pane';
import withPane from '../../src/js/hocomponents/pane';

chai.use(spies);

let url = '';

class CompWithContext extends Component {
  static childContextTypes = {
    router: PropTypes.object,
  };

  props: {
    children?: any,
  };

  getChildContext() {
    return {
      router: {
        push(data: Object): void {
          url = `${data.pathname}?${qs.stringify(data.query)}`;
        },
      },
    };
  }

  render() {
    return this.props.children;
  }
}

describe('pane from hocomponents/pane', () => {
  const ActualComp = () => (
    <div></div>
  );

  type Props = {
    onClose: Function,
    paneId: string,
    width: number,
  }

  const PaneComp = ({ onClose, paneId, width }: Props) => (
    <Pane width={width} onClose={onClose}>
      This is pane - { paneId }
    </Pane>
  );

  it('does not render the pane', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            q: 'searchQuery',
          },
          pathname: 'localhost:3000/system/rbac/users',
        },
      }),
      withPane(PaneComp, ['width'])
    )(ActualComp);

    const wrapper = mount(
      <CompWithContext>
        <Comp />
      </CompWithContext>
    );

    expect(wrapper.find(Pane)).to.have.length(0);
  });

  it('renders the pane', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            paneId: 'testPane',
            q: 'searchQuery',
          },
          pathname: 'localhost:3000/system/rbac/users',
        },
      }),
      withPane(PaneComp, ['width'])
    )(ActualComp);

    const wrapper = mount(
      <CompWithContext>
        <Comp />
      </CompWithContext>
    );

    expect(wrapper.find(Pane)).to.have.length(1);
    expect(wrapper.find(Pane).props().width).to.eql(400);
    expect(wrapper.find(Pane).props().onClose).to.be.a('function');
    expect(wrapper.find(Pane).find('.pane__content').text()).to.eql('This is pane - testPane');
  });

  it('closes the pane and modifies the url', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            paneId: 'testPane',
            q: 'searchQuery',
          },
          pathname: 'localhost:3000/system/rbac/users',
        },
      }),
      withPane(PaneComp, ['width'])
    )(ActualComp);

    const wrapper = mount(
      <CompWithContext>
        <Comp />
      </CompWithContext>
    );

    wrapper.find('.pane__close').simulate('click');

    expect(url).to.eql('localhost:3000/system/rbac/users?q=searchQuery');
  });
});