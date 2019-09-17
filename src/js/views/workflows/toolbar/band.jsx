// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Dropdown, { Item, Control } from '../../../components/dropdown';
import { injectIntl } from 'react-intl';

type BandDropdownProps = {
  band: string,
  onChange: Function,
};

const bands = ['1 hour band', '4 hour band', '24 hour band'];

const BandDropdown: Function = ({
  band,
  onChange,
  intl,
}: BandDropdownProps): React.Element<any> => (
  <Dropdown>
    <Control iconName="time">{intl.formatMessage({ id: band })}</Control>
    {bands.map(band => (
      <Item
        title={intl.formatMessage({ id: band })}
        onClick={e => onChange(e, band)}
      />
    ))}
  </Dropdown>
);

export default compose(
  onlyUpdateForKeys(['band']),
  injectIntl
)(BandDropdown);
