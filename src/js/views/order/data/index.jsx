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

const DataView = (props: Props): React.Element<any> => (
  <Box top fill>
    <Tabs id="orderDataTabs" active="static" local noContainer>
      <Pane name={props.intl.formatMessage({ id: 'order.static' })}>
        <StaticView {...props} />
      </Pane>
      <Pane name={props.intl.formatMessage({ id: 'order.dynamic' })}>
        <DynamicView {...props} />
      </Pane>
      <Pane name={props.intl.formatMessage({ id: 'order.step-specific' })}>
        <StepDataView {...props} />
      </Pane>
      <Pane name={props.intl.formatMessage({ id: 'order.sensitive' })}>
        <SensitiveView {...props} />
      </Pane>
      <Pane name={props.intl.formatMessage({ id: 'order.keys' })}>
        <KeysView {...props} />
      </Pane>
    </Tabs>
  </Box>
);

export default injectIntl(DataView);
