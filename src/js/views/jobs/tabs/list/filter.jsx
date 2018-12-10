/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import defaultProps from 'recompose/defaultProps';

import { Controls } from '../../../../components/controls';
import Dropdown, {
  Item as DropdownItem,
  Control as DropdownControl,
} from '../../../../components/dropdown';
import { JOB_STATES } from '../../../../constants/jobs';

const ResultsFilter = ({
  jobFilter,
  onFilterSelected: handleFilterSelected,
}: {
  jobFilter: string,
  onFilterSelected: Function,
}) => (
  <Controls grouped noControls>
    <Dropdown
      id="result-fitlers"
      multi
      def="all"
      submitLabel="Filter"
      selected={jobFilter.split(',')}
      onSubmit={handleFilterSelected}
    >
      <DropdownControl />
      <DropdownItem title="all" />
      {JOB_STATES.map(item => (
        <DropdownItem
          key={`job_result_${item.name}`}
          title={item.title.toLowerCase()}
        />
      ))}
    </Dropdown>
  </Controls>

);

export default compose(
  withHandlers({
    onFilterSelected: ({ onApplyJobFilter }) => selected => onApplyJobFilter(
      selected.join(',').toLowerCase()
    ),
  }),
  defaultProps({ jobFilter: 'all' })
)(ResultsFilter);
