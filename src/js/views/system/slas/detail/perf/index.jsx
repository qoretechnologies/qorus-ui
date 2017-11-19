// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import moment from 'moment';

import queryControl from '../../../../../hocomponents/queryControl';
import { DATE_FORMATS } from '../../../../../constants/dates';
import EventsToolbar from './toolbar';
import PerfView from './view';

type Props = {
  location: Object,
  minDateQuery: string,
  maxDateQuery: string,
  errQuery: string,
  errDescQuery: string,
  producerQuery: string,
  groupingQuery: string,
  successQuery: string,
  allQuery: string,
  changeAllQuery: Function,
  changeMinDateQuery: Function,
  changeMaxDateQuery: Function,
  changeErrQuery: Function,
  changeErrDescQuery: Function,
  changeGroupingQuery: Function,
  changeSuccessQuery: Function,
  changeProducerQuery: Function,
  defaultDate: string,
};

const SLAPerf: Function = ({
  ...rest,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <EventsToolbar {...rest} />
    <PerfView {...rest} />
  </div>
);

export default compose(
  queryControl('minDate'),
  queryControl('maxDate'),
  queryControl('err'),
  queryControl('errDesc'),
  queryControl('producer'),
  queryControl('grouping'),
  queryControl('success'),
  queryControl(),
  mapProps(({
    minDateQuery,
    maxDateQuery,
    errQuery,
    errDescQuery,
    producerQuery,
    groupingQuery,
    successQuery,
    ...rest,
  }: Props): Props => ({
    defaultDate: moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT),
    searchData: {
      minDate: !minDateQuery || minDateQuery === '' ?
        moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT) :
        minDateQuery,
      maxDate: maxDateQuery,
      err: errQuery,
      errDesc: errDescQuery,
      producer: producerQuery,
      grouping: groupingQuery,
      success: successQuery,
    },
    minDateQuery,
    maxDateQuery,
    errQuery,
    errDescQuery,
    producerQuery,
    groupingQuery,
    successQuery,
    ...rest,
  })),
  pure([
    'minDateQuery',
    'maxDateQuery',
    'errQuery',
    'errDescQuery',
    'producerQuery',
    'groupingQuery',
    'successQuery',
    'location',
    'searchData',
  ])
)(SLAPerf);
