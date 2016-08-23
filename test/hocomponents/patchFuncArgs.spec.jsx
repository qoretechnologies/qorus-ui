/* eslint no-unused-expressions: 0 */
import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { compose } from 'redux';
import { defaultProps } from 'recompose';

import patch from '../../src/js/hocomponents/patchFuncArgs';

chai.use(spies);

describe('search from hocomponents/search', () => {
  const ActualComp = ({ func }) => <div onClick={func} />;
  ActualComp.propTypes = {
    func: PropTypes.func,
  };

  it('patches with custom values', () => {
    const Comp = patch('func', [1, 2])(ActualComp);
    const func = chai.spy();
    const wrapper = mount(<Comp func={func} />);

    wrapper.find('div').simulate('click');

    expect(func).to.have.been.called().with(1, 2);
  });

  it('patches with defaultProps values', () => {
    const Comp = compose(
      defaultProps({
        id: 24,
      }),
      patch('func', ['id'])
    )(ActualComp);
    const func = chai.spy();
    const wrapper = mount(<Comp func={func} />);

    wrapper.find('div').simulate('click');

    expect(func).to.have.been.called().with(24);
  });
});
