import React from 'react';
import { injectIntl } from 'react-intl';
import Box from '../../../components/box';
import Tabs, { Pane } from '../../../components/tabs';
import DynamicView from './dynamic';
import KeysView from './keys';
import SensitiveView from './sensitive';
import StaticView from './static';
import StepDataView from './step';

type Props = {
  location: any;
  order: any;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const DataView = (props: Props) => (
  <Box top fill>
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Tabs id="orderDataTabs" active="static" local noContainer>
      {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */}
      <Pane name={props.intl.formatMessage({ id: 'order.static' })}>
        <StaticView {...props} />
      </Pane>
      {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */}
      <Pane name={props.intl.formatMessage({ id: 'order.dynamic' })}>
        <DynamicView {...props} />
      </Pane>
      {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */}
      <Pane name={props.intl.formatMessage({ id: 'order.step-specific' })}>
        <StepDataView {...props} />
      </Pane>
      {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */}
      <Pane name={props.intl.formatMessage({ id: 'order.sensitive' })}>
        <SensitiveView {...props} />
      </Pane>
      {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */}
      <Pane name={props.intl.formatMessage({ id: 'order.keys' })}>
        <KeysView {...props} />
      </Pane>
    </Tabs>
  </Box>
);

export default injectIntl(DataView);
