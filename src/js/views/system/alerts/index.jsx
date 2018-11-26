// @flow
import React from 'react';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import { resourceSelector, querySelector } from '../../../selectors';
import { connect } from 'react-redux';

import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import AlertsTable from './table';
import withTabs from '../../../hocomponents/withTabs';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import compose from 'recompose/compose';
import queryControl from '../../../hocomponents/queryControl';
import capitalize from 'lodash/capitalize';
import Search from '../../../containers/search';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import sync from '../../../hocomponents/sync';
import actions from '../../../store/api/actions';

type Props = {
  location: Object,
  tabQuery: string,
  handleTabChange: Function,
};

const Alerts: Function = ({
  tabQuery,
  location,
  ongoingAlerts,
  transientAlerts,
  ...rest
}: Props): React.Element<any> => (
  <div>
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
  </div>
);

const filterCollection: Function = (type: string): Function => (
  alerts: Array<Object>
): Array<Object> =>
  alerts.filter(
    (alert: Object): boolean => alert.alerttype.toLowerCase() === type
  );

const ongiongCollectionSelector = createSelector(
  [resourceSelector('alerts')],
  alerts => flowRight(filterCollection('ongoing'))(alerts.data)
);

const transientCollectionSelector = createSelector(
  [resourceSelector('alerts')],
  alerts => flowRight(filterCollection('transient'))(alerts.data)
);

const viewSelector = createSelector(
  [
    resourceSelector('alerts'),
    ongiongCollectionSelector,
    transientCollectionSelector,
  ],
  (meta, ongoingAlerts, transientAlerts) => ({
    meta,
    ongoingAlerts,
    transientAlerts,
  })
);

export default compose(
  withTabs('ongoing'),
  queryControl('ongoingSearch'),
  queryControl('transientSearch'),
  connect(
    viewSelector,
    {
      load: actions.alerts.fetch,
    }
  ),
  sync('meta'),
  queryControl(({ tabQuery }) => `${tabQuery}Search`)
)(Alerts);
