// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Dropdown, { Control, Item } from '../../../components/dropdown';

type BandDropdownProps = {
  band: string;
  onChange: Function;
};

const bands = ['1 hour band', '4 hour band', '24 hour band'];

const BandDropdown: Function = ({
  band,
  onChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'BandDropdo... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
BandDropdownProps) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: any; icon: string; }' is missing... Remove this comment to see the full error message */}
    <Control icon="time">{intl.formatMessage({ id: band })}</Control>
    {bands.map((band) => (
      <Item
        title={intl.formatMessage({ id: band })}
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        onClick={(e) => onChange(e, band)}
      />
    ))}
  </Dropdown>
);

export default compose(onlyUpdateForKeys(['band']), injectIntl)(BandDropdown);
