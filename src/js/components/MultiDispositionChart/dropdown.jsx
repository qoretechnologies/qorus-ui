// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Dropdown, { Item, Control } from '../dropdown';

type ChartBandDropdownProps = {
  chartTab: string,
  onChartTabChange: Function,
};

const ChartBandDropdown: Function = ({
  chartTab,
  onChartTabChange,
}: ChartBandDropdownProps): React.Element<any> => (
  <Dropdown>
    <Control small iconName="time">
      {chartTab}
    </Control>
    <Item title="1 hour band" action={onChartTabChange} />
    <Item title="4 hour band" action={onChartTabChange} />
    <Item title="24 hour band" action={onChartTabChange} />
  </Dropdown>
);

export default compose(onlyUpdateForKeys(['chartTab']))(ChartBandDropdown);
