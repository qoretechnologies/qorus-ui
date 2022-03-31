// @flow
import classnames from 'classnames';
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import showIfPassed from '../../hocomponents/show-if-passed';

type Props = {
  children: any;
  sortData?: Object;
  onSortChange?: Function;
  className?: string;
};

const FixedRow: Function = ({
  children,
  sortData,
  onSortChange,
  className,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <div className={classnames('table-fixed-row', className)}>
    {React.Children.map(
      children,
      (child) => child && React.cloneElement(child, { sortData, onSortChange, fixed: true })
    )}
  </div>
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ hide }) => !hide),
  onlyUpdateForKeys(['children', 'sortData', 'onSortChange', 'className'])
)(FixedRow);
