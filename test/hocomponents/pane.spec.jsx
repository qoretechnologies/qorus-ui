/* eslint no-unused-expressions: 0 */
import React, { PropTypes, Component } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import qs from 'qs';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import Pane from '../../src/js/components/pane';
import withPane from '../../src/js/hocomponents/pane';
import api from '../../src/js/store/api';

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
  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers({ api }),
      {
        api: {
          currentUser: {
            data: {
              storage: {
                rbac: {
                  paneSize: 2000,
                },
              },
              username: 'admin',
            },
          },
        },
      },
      applyMiddleware(thunk, promise)
    );
  });

  const ActualComp = () => (
    <div />
  );

  type Props = {
    onClose: Function,
    openPane: Function,
    paneId: string,
    width: number,
    changePaneTab: Function,
    onResize: Function,
  }

  const PaneComp = ({ onClose, changePaneTab, paneId, width, onResize }: Props) => (
    <Pane width={width} onClose={onClose} changePaneTab={changePaneTab} onResize={onResize}>
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
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    expect(wrapper.find(Pane)).to.have.length(0);
  });

  it('renders the pane automatically', () => {
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
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    expect(wrapper.find(Pane)).to.have.length(1);
    expect(wrapper.find(Pane).props().width).to.eql(400);
    expect(wrapper.find(Pane).props().onClose).to.be.a('function');
    expect(wrapper.find(Pane).props().onClose).to.be.a('function');
    expect(wrapper.find(Pane).props().changePaneTab).to.be.a('function');
    expect(wrapper.find(Pane).find('.pane__content').text()).to.eql('This is pane - testPane');
    expect(wrapper.find(ActualComp).props().openPane).to.be.a('function');
  });

  it('renders the pane when openPane is called with id', () => {
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
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    wrapper.find(ActualComp).props().openPane('testPane');

    expect(url).to.eql('localhost:3000/system/rbac/users?q=searchQuery&paneId=testPane');
  });

  it('opens the pane on a default tab when specified', () => {
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
      withPane(PaneComp, ['width'], 'testTab')
    )(ActualComp);

    const wrapper = mount(
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    wrapper.find(ActualComp).props().openPane('testPane');

    expect(url).to.eql(
      'localhost:3000/system/rbac/users?q=searchQuery&paneId=testPane&paneTab=testTab'
    );
  });

  it('changes the pane tab', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            q: 'searchQuery',
            paneId: 'testPane',
          },
          pathname: 'localhost:3000/system/rbac/users',
        },
      }),
      withPane(PaneComp, ['width'], 'testTab')
    )(ActualComp);

    const wrapper = mount(
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    wrapper.find(Pane).props().changePaneTab('anotherTab');

    expect(url).to.eql(
      'localhost:3000/system/rbac/users?q=searchQuery&paneId=testPane&paneTab=anotherTab'
    );
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
      withPane(PaneComp, ['width'], 'testTab')
    )(ActualComp);

    const wrapper = mount(
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    wrapper.find('.pane__close').simulate('click');

    expect(url).to.eql('localhost:3000/system/rbac/users?q=searchQuery');
  });

  it('closes the pane and removes provided queries', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            paneId: 'testPane',
            testQuery: 'test',
            anotherQuery: 'test',
            q: 'searchQuery',
          },
          pathname: 'localhost:3000/system/rbac/users',
        },
      }),
      withPane(PaneComp, ['width'])
    )(ActualComp);

    const wrapper = mount(
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    wrapper.find(Pane).props().onClose(['testQuery', 'anotherQuery']);

    expect(url).to.eql('localhost:3000/system/rbac/users?q=searchQuery');
  });

  it('passes the storage width and resize funcitons when resource is specified', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            paneId: 'testPane',
          },
          pathname: 'localhost:3000/system/rbac/users',
        },
      }),
      withPane(PaneComp, ['width'], null, 'rbac')
    )(ActualComp);

    const wrapper = mount(
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    expect(wrapper.find(Pane).props().width).to.eql(2000);
    expect(wrapper.find(Pane).props().onResize).to.be.a('function');
  });

  it('dispatches the action when onResize is called', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            paneId: 'testPane',
          },
          pathname: 'localhost:3000/system/rbac/users',
        },
      }),
      withPane(PaneComp, ['width'], null, 'rbac')
    )(ActualComp);

    const wrapper = mount(
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    expect(wrapper.find(Pane).props().width).to.eql(2000);

    store.subscribe(() => {
      expect(store.getState().api.currentUser.data.storage.rbac.paneSize).to.eql(1345);
    });

    wrapper.find(Pane).props().onResize(1345);
  });

  // eslint-disable-next-line
  it('dispatches the action when onResize is called, and does not fail if this resource is not in the storage yet ', () => {
    const Comp = compose(
      defaultProps({
        width: 400,
        location: {
          query: {
            paneId: 'testPane',
          },
          pathname: 'localhost:3000/workflows',
        },
      }),
      withPane(PaneComp, ['width'], null, 'workflows')
    )(ActualComp);

    const wrapper = mount(
      <Provider store={store}>
        <CompWithContext>
          <Comp />
        </CompWithContext>
      </Provider>
    );

    expect(wrapper.find(Pane).props().width).to.eql(400);

    store.subscribe(() => {
      expect(store.getState().api.currentUser.data.storage.workflows.paneSize).to.eql(600);
    });

    wrapper.find(Pane).props().onResize(600);
  });
});
