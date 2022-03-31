import React from 'react';

import Box from '../../../components/box';
import StaticView from './static';
import DynamicView from './dynamic';
import SensitiveView from './sensitive';
import StepDataView from './step';
import KeysView from './keys';
import Tabs, { Pane } from '../../../components/tabs';
import { injectIntl } from 'react-intl';

type Props = {
  location: Object,
  order: Object,
};

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const DataView = (props: Props): React.Element<any> => (
  <Box top fill>
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Tabs id="orderDataTabs" active="static" local noContainer>
      { /* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */ }
      <Pane name={props.intl.formatMessage({ id: 'order.static' })}>
        <StaticView {...props} />
      </Pane>
      { /* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */ }
      <Pane name={props.intl.formatMessage({ id: 'order.dynamic' })}>
        <DynamicView {...props} />
      </Pane>
      { /* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */ }
      <Pane name={props.intl.formatMessage({ id: 'order.step-specific' })}>
        <StepDataView {...props} />
      </Pane>
      { /* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */ }
      <Pane name={props.intl.formatMessage({ id: 'order.sensitive' })}>
        <SensitiveView {...props} />
      </Pane>
      { /* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: any; }' is not as... Remove this comment to see the full error message */ }
      <Pane name={props.intl.formatMessage({ id: 'order.keys' })}>
        <KeysView {...props} />
      </Pane>
    </Tabs>
  </Box>
);

export default injectIntl(DataView);
