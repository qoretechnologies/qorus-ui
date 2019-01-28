import React from 'react';

import Box from '../../../components/box';
import StaticView from './static';
import DynamicView from './dynamic';
import SensitiveView from './sensitive';
import KeysView from './keys';
import Tabs, { Pane } from '../../../components/tabs';

type Props = {
  location: Object,
  order: Object,
};

const DataView = (props: Props) => (
  <Box top fill>
    <Tabs id="orderDataTabs" active="static" local noContainer>
      <Pane name="Static">
        <StaticView {...props} />
      </Pane>
      <Pane name="Dynamic">
        <DynamicView {...props} />
      </Pane>
      <Pane name="Sensitive">
        <SensitiveView {...props} />
      </Pane>
      <Pane name="Keys">
        <KeysView {...props} />
      </Pane>
    </Tabs>
  </Box>
);

export default DataView;
