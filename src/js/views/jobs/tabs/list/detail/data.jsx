/* @flow */
import React from 'react';

import ErrorTable from './errors';
import AuditTable from './audit';
import Tabs, { Pane } from '../../../../../components/tabs';
import InfoTable from '../../../../../components/info_table';
import NoDataIf from '../../../../../components/NoDataIf';

const ResultData = ({ result }: { result: Object }) => (
  <Tabs active="info" noContainer>
    <Pane name="Info">
      <NoDataIf condition={!result.info}>
        {() => <InfoTable object={result.info} />}
      </NoDataIf>
    </Pane>
    <Pane name="Error">
      <ErrorTable errors={result.errors} />
    </Pane>
    <Pane name="Audit">
      <AuditTable audit={result.audit} />
    </Pane>
  </Tabs>
);

export default ResultData;
