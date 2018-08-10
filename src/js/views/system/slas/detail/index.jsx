// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import moment from 'moment';

import Box from '../../../../components/box';
import patch from '../../../../hocomponents/patchFuncArgs';
import sync from '../../../../hocomponents/sync';
import unsync from '../../../../hocomponents/unsync';
import actions from '../../../../store/api/actions';
import queryControl from '../../../../hocomponents/queryControl';
import { resourceSelector } from '../../../../selectors';
import { DATE_FORMATS } from '../../../../constants/dates';
import { Crumb, Breadcrumbs } from '../../../../components/breadcrumbs';
import Tabs, { Pane } from '../../../../components/tabs';

import Events from './events';
import Sources from './methods';
import Perf from './perf';
import withTabs from '../../../../hocomponents/withTabs';

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
  handleTabChange,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb link="/system/slas"> SLAs </Crumb>
      <Crumb>
        {sla.name} <small>({sla.slaid})</small>{' '}
        <small>"{sla.description}"</small>
      </Crumb>
    </Breadcrumbs>
    <Box top>
      <Tabs active={tabQuery} onChange={handleTabChange} noContainer>
        <Pane name="Events">
          <Events
            location={location}
            params={params}
            sla={sla}
            minDate={minDate}
            maxDate={maxDate}
          />
        </Pane>
        <Pane name="Sources">
          <Sources
            location={location}
            params={params}
            sla={sla}
            minDate={minDate}
            maxDate={maxDate}
          />
        </Pane>
        <Pane name="Perf">
          <Perf
            location={location}
            params={params}
            sla={sla}
            minDate={minDate}
            maxDate={maxDate}
          />
        </Pane>
      </Tabs>
    </Box>
  </div>
);

const viewSelector: Function = createSelector(
  [resourceSelector('slas')],
  (meta: Object): Object => ({
    meta,
    data: meta.data,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.slas.fetch,
      unsync: actions.slas.unsync,
    }
  ),
  queryControl('minDate'),
  queryControl('maxDate'),
  mapProps(
    ({ params, data, minDateQuery, maxDateQuery, ...rest }: Props): Props => ({
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
  withTabs('events'),
  pure(['location', 'children']),
  unsync()
)(SLADetail);
