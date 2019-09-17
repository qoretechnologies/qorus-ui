// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Dropdown, { Item, Control } from '../dropdown';
import { injectIntl } from 'react-intl';

type ChartBandDropdownProps = {
  chartTab: string,
  onChartTabChange: Function,
  intl: any,
};

const bands = ['1 hour band', '4 hour band', '24 hour band'];

const ChartBandDropdown: Function = ({
  chartTab,
  onChartTabChange,
  intl,
}: ChartBandDropdownProps): React.Element<any> => (
  <Dropdown>
    <Control small iconName="time">
      {intl.formatMessage({ id: chartTab })}
    </Control>
    {bands.map(chartTab => (
      <Item
        title={intl.formatMessage({ id: chartTab })}
        onClick={e => onChartTabChange(e, chartTab)}
      />
    ))}
  </Dropdown>
);

export default compose(
  onlyUpdateForKeys(['chartTab']),
  injectIntl
)(ChartBandDropdown);
