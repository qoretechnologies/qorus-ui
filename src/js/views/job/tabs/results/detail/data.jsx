/* @flow */
import React from 'react';

import Tabs, { Pane } from '../../../../../components/tabs';
import ErrorTable from './errors';
import AuditTable from './audit';

const ResultData = ({ result }: { result: Object }) => (
  <Tabs>
    <Pane name="Error">
      <ErrorTable errors={result.errors} />
    </Pane>
    <Pane name="Audit">
      <AuditTable audit={result.audit} />
    </Pane>
    <Pane name="Info">{result.info && result.info.info || 'No data found'}</Pane>
  </Tabs>
);

export default ResultData;
