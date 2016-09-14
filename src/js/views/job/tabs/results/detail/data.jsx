/* @flow */
import React from 'react';

import ErrorTable from './errors';
import AuditTable from './audit';
import Tabs, { Pane } from '../../../../../components/tabs';
import Tree from '../../../../../components/tree';

const ResultData = ({ result }: { result: Object }) => (
  <Tabs>
    <Pane name="Error">
      <ErrorTable errors={result.errors} />
    </Pane>
    <Pane name="Audit">
      <AuditTable audit={result.audit} />
    </Pane>
    <Pane name="Info">
      <Tree data={result.info} />
    </Pane>
  </Tabs>
);

export default ResultData;
