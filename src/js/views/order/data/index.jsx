import React from 'react';

import Box from 'components/box';
import StaticView from './static';
import DynamicView from './dynamic';
import SensitiveView from './sensitive';
import KeysView from './keys';
import Tabs, { Pane } from '../../../components/tabs';
import Container from '../../../components/container';

type Props = {
  location: Object,
  order: Object,
};

const DataView = (props: Props) => (
  <Box top>
    <Tabs id="orderDataTabs" active="static" noContainer>
      <Pane name="Static">
        <Container fill>
          <StaticView {...props} />
        </Container>
      </Pane>
      <Pane name="Dynamic">
        <Container fill>
          <DynamicView {...props} />
        </Container>
      </Pane>
      <Pane name="Sensitive">
        <Container fill>
          <SensitiveView {...props} />
        </Container>
      </Pane>
      <Pane name="Keys">
        <Container fill>
          <KeysView {...props} />
        </Container>
      </Pane>
    </Tabs>
  </Box>
);

export default DataView;

export { StaticView, DynamicView, KeysView, SensitiveView };
