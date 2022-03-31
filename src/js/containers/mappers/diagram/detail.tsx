/* @flow */
import React from 'react';
import Box from '../../../components/box';
import InfoTable from '../../../components/info_table';
import SourceCode from '../../../components/source_code';
import Tabs, { Pane } from '../../../components/tabs';

type Props = {
  data: any;
};

const DiagramDetail: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
  data: { code, ...rest },
  // @ts-ignore ts-migrate(2339) FIXME: Property 'tab' does not exist on type 'Props'.
  tab,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Tabs active={tab}>
    {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
    <Pane name="Info">
      <Box top fill>
        <InfoTable object={rest} />
      </Box>
    </Pane>
    {code && (
      // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
      <Pane name="Code">
        <Box top fill>
          {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
          <SourceCode>{code}</SourceCode>
        </Box>
      </Pane>
    )}
  </Tabs>
);

export default DiagramDetail;
