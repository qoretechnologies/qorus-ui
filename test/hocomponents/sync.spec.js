/* eslint no-unused-expressions: 0 */
import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import sync from '../../src/js/hocomponents/sync';

chai.use(spies);


describe('sync from hocomponents/sync', () => {
  const ActualComp = ({ value }) => <div className="actual">{value.data}</div>;
  ActualComp.propTypes = {
    value: PropTypes.object,
  };

  const CompOrLoader = sync('value')(ActualComp);
  const Comp = sync('value', false)(ActualComp);

  it('Load if not loading and not sync', () => {
    const load = chai.spy();
    const value = {
      loading: false,
      sync: false,
    };

    mount(<Comp {...{ load, value }} />);

    expect(load).to.have.been.called;
  });

  it('Do not load if loading', () => {
    const load = chai.spy();
    const value = {
      loading: true,
      sync: false,
    };

    mount(<Comp {...{ load, value }} />);

    expect(load).to.not.have.been.called;
  });

  it('Do not load if sync', () => {
    const load = chai.spy();
    const value = {
      loading: false,
      sync: true,
    };

    mount(<Comp {...{ load, value }} />);

    expect(load).to.not.have.been.called;
  });

  it('Show loader on loading', () => {
    const load = chai.spy();
    const value = {
      loading: true,
      sync: false,
    };

    const wrapper = mount(<CompOrLoader {...{ load, value }} />);

    expect(wrapper.find('.fa-spin').length).to.equals(1);
    expect(wrapper.find('.actual').length).to.equals(0);
  });

  it('Show actual on loading', () => {
    const load = chai.spy();
    const value = {
      loading: true,
      sync: false,
    };

    const wrapper = mount(<Comp {...{ load, value }} />);

    expect(wrapper.find('.fa-spin').length).to.equals(0);
    expect(wrapper.find('.actual').length).to.equals(1);
  });

  it('Show actual if not loading and sync', () => {
    const load = chai.spy();
    const value = {
      loading: false,
      sync: true,
    };

    const wrapper = mount(<CompOrLoader {...{ load, value }} />);

    expect(wrapper.find('.fa-spin').length).to.equals(0);
    expect(wrapper.find('.actual').length).to.equals(1);
  });
});
