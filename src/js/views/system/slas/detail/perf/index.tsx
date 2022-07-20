// @flow
import moment from 'moment';
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import Flex from '../../../../../components/Flex';
import { DATE_FORMATS } from '../../../../../constants/dates';
import queryControl from '../../../../../hocomponents/queryControl';
import EventsToolbar from './toolbar';
import PerfView from './view';

type Props = {
  location: any;
  minDateQuery: string;
  maxDateQuery: string;
  errQuery: string;
  errDescQuery: string;
  producerQuery: string;
  groupingQuery: string;
  successQuery: string;
  allQuery: string;
  changeAllQuery: Function;
  changeMinDateQuery: Function;
  changeMaxDateQuery: Function;
  changeErrQuery: Function;
  changeErrDescQuery: Function;
  changeGroupingQuery: Function;
  changeSuccessQuery: Function;
  changeProducerQuery: Function;
  defaultDate: string;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const SLAPerf: Function = ({ ...rest }: Props) => (
  <Flex>
    <EventsToolbar {...rest} />
    <PerfView {...rest} />
  </Flex>
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('minDate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxDate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('err'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('errDesc'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('producer'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('grouping'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('success'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  mapProps(
    ({
      minDateQuery,
      maxDateQuery,
      errQuery,
      errDescQuery,
      producerQuery,
      groupingQuery,
      successQuery,
      ...rest
    }: Props): Props => ({
      defaultDate: moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT),
      // @ts-ignore ts-migrate(2322) FIXME: Type '{ location: any; allQuery: string; change... Remove this comment to see the full error message
      searchData: {
        minDate:
          !minDateQuery || minDateQuery === ''
            ? moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT)
            : minDateQuery,
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
    })
  ),
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
