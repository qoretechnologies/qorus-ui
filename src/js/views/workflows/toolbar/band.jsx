// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Dropdown, { Item, Control } from '../../../components/dropdown';

type BandDropdownProps = {
  band: string,
  onChange: Function,
};

const BandDropdown: Function = ({
  band,
  onChange,
}: BandDropdownProps): React.Element<any> => (
  <Dropdown>
    <Control iconName="time">{band}</Control>
    <Item title="1 hour band" onClick={onChange} />
    <Item title="4 hour band" onClick={onChange} />
    <Item title="24 hour band" onClick={onChange} />
  </Dropdown>
);

export default compose(onlyUpdateForKeys(['band']))(BandDropdown);
