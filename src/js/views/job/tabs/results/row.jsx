/* @flow */
import React from 'react';

import { Row } from '../../../../components/table';

type Props = {
  selectResult: Function,
  item: Object,
  updateDone: Function,
  children: any,
};

const JobInstanceRow: Function = ({
  selectResult,
  item,
  updateDone,
  children,
}: Props): React.Element<any> => {
  const handleUpdateDone = () => {
    updateDone(item.jobid, item.id);
  };

  const handleClick= () => {
    selectResult(item);
  };

  return (
    <Row
      onClick={handleClick}
      highlight={item._updated}
      onHighlightEnd={handleUpdateDone}
    >
      { children }
    </Row>
  );
};

export default JobInstanceRow;
