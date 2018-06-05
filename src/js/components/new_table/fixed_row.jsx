// @flow
import React from 'react';

type Props = {
  children: any,
  sortData?: Object,
  onSortChange?: Function,
};

const FixedRow: Function = ({
  children,
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <div>
    {React.Children.map(
      children,
      child =>
        child &&
        React.cloneElement(child, { sortData, onSortChange, fixed: true })
    )}
  </div>
);

export default FixedRow;
