/* eslint no-unused-expressions: 0 */
import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import SearchComponent from '../../src/js/components/search';
import search from '../../src/js/hocomponents/search';

chai.use(spies);

describe('search from hocomponents/sync', () => {
  const ActualComp = ({ onSearchChange }) => (
    <SearchComponent onSearchUpdate={onSearchChange} />
  );
  ActualComp.propTypes = {
    onSearchChange: PropTypes.func,
  };

  it('search func is in props', () => {
    const Comp = search('test', 'test')(ActualComp);
    const wrapper = mount(<Comp />);

    expect(wrapper.find(ActualComp).first().props().onSearchChange).to.be.a('function');
  });

  it('calls the search function passed as a prop', () => {
    const Comp = search('test', 'test')(ActualComp);
    const func = chai.spy();
    const wrapper = mount(<Comp onSearchChange={func} />);

    wrapper.find(ActualComp).find(SearchComponent).props().onSearchUpdate('Test');

    expect(func).to.have.been.called().with('Test');
  });

  it('calls the search function passed as a custom argument', () => {
    const func = chai.spy();
    const Comp = search('test', 'test', func)(ActualComp);
    const wrapper = mount(<Comp />);

    wrapper.find(ActualComp).find(SearchComponent).props().onSearchUpdate('Hello');

    expect(func).to.have.been.called().with('Hello');
  });
});
