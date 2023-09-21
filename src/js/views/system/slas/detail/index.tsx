// @flow
import moment from 'moment';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import Flex from '../../../../components/Flex';
import { SimpleTab, SimpleTabs } from '../../../../components/SimpleTabs';
import Box from '../../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../../components/breadcrumbs';
import { DATE_FORMATS } from '../../../../constants/dates';
import patch from '../../../../hocomponents/patchFuncArgs';
import queryControl from '../../../../hocomponents/queryControl';
import sync from '../../../../hocomponents/sync';
import unsync from '../../../../hocomponents/unsync';
import withTabs from '../../../../hocomponents/withTabs';
import { resourceSelector } from '../../../../selectors';
import actions from '../../../../store/api/actions';
import Events from './events';
import Sources from './methods';
import Perf from './perf';

type Props = {
  location: any;
  params: any;
  children: any;
  sla: any;
  data: Array<Object>;
  minDate: string;
  maxDate: string;
  minDateQuery?: string;
  maxDateQuery?: string;
  tabQuery?: string;
  handleTabChange: Function;
};

const SLADetail: Function = ({
  location,
  params,
  sla,
  minDate,
  maxDate,
  tabQuery,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex>
    <Breadcrumbs>
      <Crumb link="/slas"> SLAs </Crumb>
      <Crumb>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
        {sla.name} <small>({sla.slaid})</small>
      </Crumb>
      <CrumbTabs tabs={['Performance', 'Events', 'Sources']} defaultTab="performance" />
    </Breadcrumbs>
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
          <Perf location={location} params={params} sla={sla} minDate={minDate} maxDate={maxDate} />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </Flex>
);

const viewSelector: Function = createSelector([resourceSelector('slas')], (meta: any): any => ({
  meta,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  data: meta.data,
}));

export default compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
    load: actions.slas.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
    unsync: actions.slas.unsync,
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('minDate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxDate'),
  mapProps(
    ({ params, data, minDateQuery, maxDateQuery, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2322) FIXME: Type '{ location: any; children: any; sla: Obje... Remove this comment to see the full error message
      id: params.id,
      params,
      fetchParams: null,
      sla: data.length ? data[0] : {},
      data,
      minDate:
        !minDateQuery || minDateQuery === ''
          ? moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT)
          : minDateQuery,
      maxDate: !maxDateQuery || maxDateQuery === '' ? '' : maxDateQuery,
      ...rest,
    })
  ),
  patch('load', ['fetchParams', 'id']),
  sync('meta'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('performance'),
  pure(['location', 'children']),
  unsync()
)(SLADetail);
