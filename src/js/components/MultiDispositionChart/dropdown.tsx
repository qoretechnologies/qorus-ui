// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Dropdown, { Control, Item } from '../dropdown';

type ChartBandDropdownProps = {
  chartTab: string;
  onChartTabChange: Function;
  intl: any;
};

const bands = ['1 hour band', '4 hour band', '24 hour band'];

const ChartBandDropdown: Function = ({
  chartTab,
  onChartTabChange,
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ChartBandDropdownProps): React.Element<any> => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; small: true; icon: string; ... Remove this comment to see the full error message */}
    <Control small icon="time">
      {intl.formatMessage({ id: chartTab })}
    </Control>
    {bands.map((chartTab) => (
      <Item
        title={intl.formatMessage({ id: chartTab })}
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        onClick={(e) => onChartTabChange(e, chartTab)}
      />
    ))}
  </Dropdown>
);

export default compose(onlyUpdateForKeys(['chartTab']), injectIntl)(ChartBandDropdown);
