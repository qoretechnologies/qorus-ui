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
      {result.info && (<Tree data={result.info} />)}
      {!result.info && (<p className="no-data">No data found</p>)}
    </Pane>
  </Tabs>
);

export default ResultData;
