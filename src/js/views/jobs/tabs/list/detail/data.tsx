/* @flow */
import React from 'react';
import InfoTable from '../../../../../components/info_table';
import NoDataIf from '../../../../../components/NoDataIf';
import Tabs, { Pane } from '../../../../../components/tabs';
import AuditTable from './audit';
import ErrorTable from './errors';

const ResultData = ({ result }: { result: any }) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Tabs active="info" noContainer>
    {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
    <Pane name="Info">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'. */}
      <NoDataIf condition={!result.info}>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'. */}
        {() => <InfoTable object={result.info} />}
      </NoDataIf>
    </Pane>
    {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
    <Pane name="Error">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'errors' does not exist on type 'Object'. */}
      <ErrorTable errors={result.errors} />
    </Pane>
    {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
    <Pane name="Audit">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'audit' does not exist on type 'Object'. */}
      <AuditTable audit={result.audit} />
    </Pane>
  </Tabs>
);

export default ResultData;
