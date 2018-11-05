/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import ResultsFilter from './filter';
import applyDate from '../../../../hocomponents/apply-date';
import applyJobFilter from '../../../../hocomponents/jobs/apply-job-filter';
import Toolbar from '../../../../components/toolbar';
import DatePicker from '../../../../components/datepicker';
import CsvExport from '../../../../components/csv_export';

const ResultsToolbar = ({
  date,
  job,
  jobFilter,
  onApplyDate,
  onApplyJobFilter,
}: {
  date: string,
  job: Object,
  defaultSearchValue: string,
  jobFilter: string,
  onApplyDate: Function,
  onSearchChange: Function,
  onApplyJobFilter: Function,
}) => (
  <Toolbar mb>
    <DatePicker className="toolbar-item" {...{ date, onApplyDate }} />
    <ResultsFilter {...{ jobFilter, onApplyJobFilter }} />
    <CsvExport
      collection={(job.results && job.results.data) || []}
      type="jobResults"
    />
  </Toolbar>
);

const toolbar = (name: string, path: string): Function =>
  compose(...[applyDate, applyJobFilter].map(func => func(name, path)));

export default compose(toolbar('job', 'job/(:id)/results'))(ResultsToolbar);
