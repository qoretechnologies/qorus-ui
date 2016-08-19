/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import defaultProps from 'recompose/defaultProps';

import { Controls, Control } from '../../../../components/controls';

const ResultsFilter = ({
  jobFilter,
  onFilterAll,
  onFilterComplete,
  onFilterError,
}: {
  jobFilter: string,
  onFilterAll: Function,
  onFilterComplete: Function,
  onFilterError: Function
}) => (
  <Controls grouped noControls>
    <Control
      label="All"
      btnStyle={jobFilter === 'all' ? 'primary' : 'default'}
      onClick={onFilterAll}
      big
    />
    <Control
      label="Complete"
      btnStyle={jobFilter === 'complete' ? 'primary' : 'default'}
      onClick={onFilterComplete}
      big
    />
    <Control
      label="Error"
      btnStyle={jobFilter === 'error' ? 'primary' : 'default'}
      onClick={onFilterError}
      big
    />
  </Controls>
);

export default compose(
  withHandlers({
    onFilterAll: ({ onApplyJobFilter }) => () => onApplyJobFilter('all'),
    onFilterComplete: ({ onApplyJobFilter }) => () => onApplyJobFilter('complete'),
    onFilterError: ({ onApplyJobFilter }) => () => onApplyJobFilter('error'),
  }),
  defaultProps({ jobFilter: 'all' })
)(ResultsFilter);
