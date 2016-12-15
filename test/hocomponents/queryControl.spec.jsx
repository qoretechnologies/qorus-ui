/* eslint no-unused-expressions: 0 */
import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import SearchComponent from '../../src/js/components/search';
import queryControl from '../../src/js/hocomponents/queryControl';

chai.use(spies);

describe('queryControl from hocomponents/queryControl', () => {
  const ActualComp = ({ changeSearchQuery }) => (
    <SearchComponent onSearchUpdate={changeSearchQuery} />
  );
  ActualComp.propTypes = {
    changeSearchQuery: PropTypes.func,
  };

  const location = { query: { Search: 'test' } };

  it('search func is in props', () => {
    const Comp = queryControl('search')(ActualComp);
    const wrapper = mount(<Comp {...{ location }} />);

    expect(wrapper.find(ActualComp).first().props().changeSearchQuery).to.be.a('function');
  });

  it('calls the search function passed as a prop', () => {
    const Comp = queryControl('search')(ActualComp);
    const func = chai.spy();
    const wrapper = mount(<Comp changeSearchQuery={func} {...{ location }} />);

    wrapper.find(ActualComp).find(SearchComponent).props().onSearchUpdate('Test');

    expect(func).to.have.been.called().with('Test');
  });

  it('calls the search function passed as a custom argument', () => {
    const func = chai.spy();
    const Comp = queryControl('search', func)(ActualComp);
    const wrapper = mount(<Comp {...{ location }} />);

    wrapper.find(ActualComp).find(SearchComponent).props().onSearchUpdate('Hello');

    expect(func).to.have.been.called().with('Hello');
  });
});
