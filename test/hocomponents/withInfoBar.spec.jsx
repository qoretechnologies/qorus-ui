import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import withInfoBar from '../../src/js/hocomponents/withInfoBar';

describe('withInfoBar from "hocomponents/withInfoBar"', () => {
  const ActualComp = (props: Object): React.Element<any> => (
    <div>
      {props.infoTotalCount}
      {props.infoWithAlerts}
      {props.infoEnabled}
    </div>
  );

  const testData = [
    {
      has_alerts: true,
      enabled: true,
    },
    {
      has_alerts: true,
      enabled: true,
    },
    {
      has_alerts: true,
      enabled: true,
    },
    {
      has_alerts: true,
      enabled: false,
    },
    {
      has_alerts: false,
      enabled: false,
    },
  ];

  it('renders the component with all props', () => {
    const Comp = withInfoBar('testData')(ActualComp);
    const wrapper = mount(
      <Comp {...{ testData }} />
    );

    expect(wrapper.find('div').text()).to.equal('543');
  });
});
