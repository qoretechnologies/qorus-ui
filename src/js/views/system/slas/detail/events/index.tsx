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
import Flex from '../../../../../components/Flex';

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

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const SLAEvents: Function = ({ ...rest }: Props): React.Element<any> => (
  <Flex>
    <EventsToolbar {...rest} />
    <EventsView {...rest} />
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
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  mapProps(
    ({
      minDateQuery,
      maxDateQuery,
      errQuery,
      errDescQuery,
      producerQuery,
      ...rest
    }: Props): Props => ({
      defaultDate: moment()
        .add(-1, 'weeks')
        .format(DATE_FORMATS.URL_FORMAT),
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
      },
      minDateQuery,
      maxDateQuery,
      errQuery,
      errDescQuery,
      producerQuery,
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ location: Object; params: Object; searchDa... Remove this comment to see the full error message
      fetchParams: null,
      ...rest,
    })
  ),
  pure(['searchData', 'allQuery', 'collection', 'location'])
)(SLAEvents);
