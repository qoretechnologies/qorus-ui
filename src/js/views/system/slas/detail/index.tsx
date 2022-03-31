// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import moment from 'moment';

import Box from '../../../../components/box';
import Headbar from '../../../../components/Headbar';
import patch from '../../../../hocomponents/patchFuncArgs';
import sync from '../../../../hocomponents/sync';
import unsync from '../../../../hocomponents/unsync';
import actions from '../../../../store/api/actions';
import queryControl from '../../../../hocomponents/queryControl';
import { resourceSelector } from '../../../../selectors';
import { DATE_FORMATS } from '../../../../constants/dates';
import {
  Crumb,
  Breadcrumbs,
  CrumbTabs,
} from '../../../../components/breadcrumbs';
import { SimpleTabs, SimpleTab } from '../../../../components/SimpleTabs';

import Events from './events';
import Sources from './methods';
import Perf from './perf';
import withTabs from '../../../../hocomponents/withTabs';
import Flex from '../../../../components/Flex';

type Props = {
  location: Object,
  params: Object,
  children: any,
  sla: Object,
  data: Array<Object>,
  minDate: string,
  maxDate: string,
  minDateQuery?: string,
  maxDateQuery?: string,
  tabQuery?: string,
  handleTabChange: Function,
};

const SLADetail: Function = ({
  location,
  params,
  sla,
  minDate,
  maxDate,
  tabQuery,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb link="/slas"> SLAs </Crumb>
        <Crumb>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */ }
          {sla.name} <small>({sla.slaid})</small>
        </Crumb>
        <CrumbTabs
          tabs={['Events', 'Sources', 'Performance']}
          defaultTab="events"
        />
      </Breadcrumbs>
    </Headbar>
    <Box top>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="events">
          <Events
            location={location}
            params={params}
            sla={sla}
            minDate={minDate}
            maxDate={maxDate}
          />
        </SimpleTab>
        <SimpleTab name="sources">
          <Sources
            location={location}
            params={params}
            sla={sla}
            minDate={minDate}
            maxDate={maxDate}
          />
        </SimpleTab>
        <SimpleTab name="performance">
          <Perf
            location={location}
            params={params}
            sla={sla}
            minDate={minDate}
            maxDate={maxDate}
          />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </Flex>
);

const viewSelector: Function = createSelector(
  [resourceSelector('slas')],
  (meta: Object): Object => ({
    meta,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    data: meta.data,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
      load: actions.slas.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
      unsync: actions.slas.unsync,
    }
  ),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('minDate'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxDate'),
  mapProps(
    ({ params, data, minDateQuery, maxDateQuery, ...rest }: Props): Props => ({
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ location: Object; children: any; sla: Obje... Remove this comment to see the full error message
      id: params.id,
      params,
      fetchParams: null,
      sla: data.length ? data[0] : {},
      data,
      minDate:
        !minDateQuery || minDateQuery === ''
          ? moment()
            .add(-1, 'weeks')
            .format(DATE_FORMATS.URL_FORMAT)
          : minDateQuery,
      maxDate: !maxDateQuery || maxDateQuery === '' ? '' : maxDateQuery,
      ...rest,
    })
  ),
  patch('load', ['fetchParams', 'id']),
  sync('meta'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('events'),
  pure(['location', 'children']),
  unsync()
)(SLADetail);
