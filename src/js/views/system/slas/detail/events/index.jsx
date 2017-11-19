// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import moment from 'moment';

import queryControl from '../../../../../hocomponents/queryControl';
import { DATE_FORMATS } from '../../../../../constants/dates';
import EventsToolbar from './toolbar';
import EventsView from './view';

type Props = {
  location: Object,
  params: Object,
  minDateQuery: string,
  maxDateQuery: string,
  errQuery: string,
  errDescQuery: string,
  producerQuery: string,
  searchData: Object,
  collection: Array<Object>,
  allQuery: string,
  changeAllQuery: Function,
  changeMinDateQuery: Function,
  changeMaxDateQuery: Function,
  changeErrQuery: Function,
  changeErrDescQuery: Function,
  changeProducerQuery: Function,
  defaultDate: string,
};

const SLAEvents: Function = ({
  ...rest,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <EventsToolbar {...rest} />
    <EventsView {...rest} />
  </div>
);

export default compose(
  queryControl('minDate'),
  queryControl('maxDate'),
  queryControl('err'),
  queryControl('errDesc'),
  queryControl('producer'),
  queryControl(),
  mapProps(({
    minDateQuery,
    maxDateQuery,
    errQuery,
    errDescQuery,
    producerQuery,
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
    },
    minDateQuery,
    maxDateQuery,
    errQuery,
    errDescQuery,
    producerQuery,
    fetchParams: null,
    ...rest,
  })),
  pure([
    'searchData',
    'allQuery',
    'collection',
    'location',
  ]),
)(SLAEvents);
