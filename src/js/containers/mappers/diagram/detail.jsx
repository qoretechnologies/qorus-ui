/* @flow */
import React from 'react';
import omit from 'lodash/omit';

import InfoTable from '../../../components/info_table';
import SourceCode from '../../../components/source_code';
import Tabs, { Pane } from '../../../components/tabs';
import Box from '../../../components/box';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';

type Props = {
  data: Object,
};

const DiagramDetail: Function = ({
  data: { code, ...rest },
  tab,
}: Props): React.Element<any> => (
  <Tabs active={tab}>
    <Pane name="Info">
      <Box top fill>
        <InfoTable object={rest} />
      </Box>
    </Pane>
    {code && (
      <Pane name="Code">
        <Box top fill>
          <SourceCode>{code}</SourceCode>
        </Box>
      </Pane>
    )}
  </Tabs>
);

export default DiagramDetail;
