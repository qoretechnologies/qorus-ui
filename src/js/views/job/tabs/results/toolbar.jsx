/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import ResultsFilter from './filter';
import applyDate from '../../../../hocomponents/apply-date';
import applyJobFilter from '../../../../hocomponents/apply-job-filter';
import search from '../../../../hocomponents/search';
import Toolbar from '../../../../components/toolbar';
import DatePicker from '../../../../components/datepicker';
import Search from '../../../../components/search';

const ResultsToolbar = ({
  date,
  defaultSearchValue,
  jobFilter,
  onApplyDate,
  onSearchChange,
  onApplyJobFilter,
}: {
  date: string,
  defaultSearchValue: string,
  jobFilter: string,
  onApplyDate: Function,
  onSearchChange: Function,
  onApplyJobFilter: Function,
}) => (
  <Toolbar>
    <DatePicker {...{ date, onApplyDate }} />
    <ResultsFilter {...{ jobFilter, onApplyJobFilter }} />
    <Search
      defaultValue={defaultSearchValue}
      onSearchUpdate={onSearchChange}
    />
  </Toolbar>
);

const toolbar = (name: string, path: string): Function => compose(
    ...[
      applyDate,
      applyJobFilter,
      search,
    ].map(func => func(name, path))
);

export default compose(
  toolbar('job', 'job/(:id)/results')
)(ResultsToolbar);
