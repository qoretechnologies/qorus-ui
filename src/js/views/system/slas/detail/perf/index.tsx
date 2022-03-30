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
import Flex from '../../../../../components/Flex';

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

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const SLAPerf: Function = ({ ...rest }: Props): React.Element<any> => (
  <Flex>
    <EventsToolbar {...rest} />
    <PerfView {...rest} />
  </Flex>
);

export default compose(
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('minDate'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxDate'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('err'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('errDesc'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('producer'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('grouping'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('success'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
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
      defaultDate: moment()
        .add(-1, 'weeks')
        .format(DATE_FORMATS.URL_FORMAT),
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ location: Object; allQuery: string; change... Remove this comment to see the full error message
      searchData: {
        minDate:
          !minDateQuery || minDateQuery === ''
            ? moment()
                .add(-1, 'weeks')
                .format(DATE_FORMATS.URL_FORMAT)
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
