// @flow
import { flowRight } from 'lodash';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import sync from '../../../hocomponents/sync';
import withTabs from '../../../hocomponents/withTabs';
import { resourceSelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import AlertsTable from './table';

type Props = {
  location: Object;
  tabQuery: string;
  handleTabChange: Function;
  ongoingAlerts: Array<Object>;
  transientAlerts: Array<Object>;
};

const Alerts: Function = ({
  tabQuery,
  location,
  ongoingAlerts,
  transientAlerts,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb> Alerts </Crumb>
        <CrumbTabs
          tabs={[
            { title: 'Ongoing', suffix: `(${ongoingAlerts.length})` },
            { title: 'Transient', suffix: `(${transientAlerts.length})` },
          ]}
          defaultTab="ongoing"
        />
      </Breadcrumbs>
      <Pull right>
        <Search
          defaultValue={rest[`${tabQuery}SearchQuery`]}
          onSearchUpdate={rest[`change${capitalize(tabQuery)}SearchQuery`]}
          resource="alerts"
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="ongoing">
          <AlertsTable
            location={location}
            type="ongoing"
            alerts={ongoingAlerts}
            query={rest[`${tabQuery}SearchQuery`]}
          />
        </SimpleTab>
        <SimpleTab name="transient">
          <AlertsTable
            location={location}
            type="transient"
            alerts={transientAlerts}
            query={rest[`${tabQuery}SearchQuery`]}
          />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </Flex>
);

const filterCollection: Function =
  (type: string): Function =>
  (alerts: Array<Object>): Array<Object> =>
    alerts.filter(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'alerttype' does not exist on type 'Objec... Remove this comment to see the full error message
      (alert: Object): boolean => alert.alerttype.toLowerCase() === type
    );

const ongiongCollectionSelector = createSelector([resourceSelector('alerts')], (alerts) =>
  flowRight(filterCollection('ongoing'))(alerts.data)
);

const transientCollectionSelector = createSelector([resourceSelector('alerts')], (alerts) =>
  flowRight(filterCollection('transient'))(alerts.data)
);

const viewSelector = createSelector(
  [resourceSelector('alerts'), ongiongCollectionSelector, transientCollectionSelector],
  (meta, ongoingAlerts, transientAlerts) => ({
    meta,
    ongoingAlerts,
    transientAlerts,
  })
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('ongoing'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('ongoingSearch'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('transientSearch'),
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'alerts' does not exist on type '{}'.
    load: actions.alerts.fetch,
  }),
  sync('meta'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl(({ tabQuery }) => `${tabQuery}Search`)
)(Alerts);
