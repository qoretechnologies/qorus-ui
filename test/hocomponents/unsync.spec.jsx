// @flow
import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import unsync from '../../src/js/hocomponents/unsync';

chai.use(spies);

describe('unsync from hocomponents/unsync', () => {
  const Comp: Function = (): React.Element<any> => (
    <div></div>
  );

  it('runs the default unsync function on unmount', () => {
    const Enhanced = unsync()(Comp);
    const action = chai.spy();
    const wrapper = mount(<Enhanced unsync={action} />);

    wrapper.unmount();

    expect(action).to.have.been.called();
  });

  it('runs the provided function on unmount', () => {
    const Enhanced = unsync('custom')(Comp);
    const action = chai.spy();
    const customAction = chai.spy();
    const wrapper = mount(<Enhanced custom={customAction} unsync={action} />);

    wrapper.unmount();

    expect(action).to.have.not.been.called();
    expect(customAction).to.have.been.called();
  });
});
