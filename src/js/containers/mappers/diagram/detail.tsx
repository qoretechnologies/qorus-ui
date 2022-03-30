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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
  data: { code, ...rest },
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'tab' does not exist on type 'Props'.
  tab,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Tabs active={tab}>
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
    <Pane name="Info">
      <Box top fill>
        <InfoTable object={rest} />
      </Box>
    </Pane>
    {code && (
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
      <Pane name="Code">
        <Box top fill>
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          <SourceCode>{code}</SourceCode>
        </Box>
      </Pane>
    )}
  </Tabs>
);

export default DiagramDetail;
