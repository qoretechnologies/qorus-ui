// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import InfoTable from '../info_table';
import NoDataIf from '../NoDataIf';
import Tree from '../tree';

type ProcessTableProps = {
  model: Object,
};

const ProcessTable: Function = ({
  model,
}: ProcessTableProps): React.Element<any> => (
  <NoDataIf
    condition={!model || !model.process}
    big
    content="This interface is not running under a process"
  >
    {() => (
      <Tree
        data={{
          ...model.process,
          ...{ memory: model.process.priv_str },
        }}
      />
    )}
  </NoDataIf>
);

export default compose(onlyUpdateForKeys(['model']))(ProcessTable);
