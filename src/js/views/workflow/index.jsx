// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import sync from '../../hocomponents/sync';
import withTabs from '../../hocomponents/withTabs';
import unsync from '../../hocomponents/unsync';
import patch from '../../hocomponents/patchFuncArgs';
import {
  querySelector,
  resourceSelector,
  paramSelector,
} from '../../selectors';
import actions from '../../store/api/actions';
import { DATES, DATE_FORMATS } from '../../constants/dates';
import { formatDate } from '../../helpers/workflows';
import Header from './header';
import Box from '../../components/box';
import Tabs, { Pane } from '../../components/tabs';
import List from './tabs/list';
import Performance from './tabs/performance';
import Log from './tabs/log';
import Code from './tabs/code';
import Info from './tabs/info';
import Mappers from './tabs/mappers';
import titleManager from '../../hocomponents/TitleManager';

type Props = {
  workflow: Object,
  date: string,
  linkDate: string,
  fetchParams: Object,
  id: number,
  unselectAll: Function,
  fetch: Function,
  location: Object,
  children: any,
  handleTabChange: Function,
  tabQuery: string,
};

const Workflow: Function = ({
  workflow,
  date,
  location,
  linkDate,
  handleTabChange,
  tabQuery,
}: Props): React.Element<any> => (
  <div>
    <Header {...workflow} date={date} />
    <Box>
      <Tabs
        active={tabQuery}
        id="workflowOrder"
        onChange={handleTabChange}
        noContainer
      >
        <Pane name="List">
          <List {...{ workflow, date, location, linkDate }} />
        </Pane>
        <Pane name="Performance">
          <Performance {...{ workflow, date, location, linkDate }} />
        </Pane>
        <Pane name="Log">
          <Log {...{ workflow, date, location, linkDate }} />
        </Pane>
        <Pane name="Code">
          <Code {...{ workflow, date, location, linkDate }} />
        </Pane>
        <Pane name="Info">
          <Info {...{ workflow, date, location, linkDate }} />
        </Pane>
        <Pane name="Mappers">
          <Mappers {...{ workflow, date, location, linkDate }} />
        </Pane>
      </Tabs>
    </Box>
  </div>
);

const workflowSelector: Function = (state: Object, props: Object): Object =>
  state.api.workflows.data.find(
    (workflow: Object) =>
      parseInt(props.params.id, 10) === parseInt(workflow.id, 10)
  );

const selector: Object = createSelector(
  [
    resourceSelector('workflows'),
    workflowSelector,
    querySelector('date'),
    paramSelector('id'),
  ],
  (meta, workflow, date, id) => ({
    meta,
    workflow,
    date,
    id: parseInt(id, 10),
  })
);

export default compose(
  connect(
    selector,
    {
      load: actions.workflows.fetch,
      fetch: actions.workflows.fetch,
      unsync: actions.workflows.unsync,
      unselectAll: actions.orders.unselectAll,
    }
  ),
  mapProps(
    ({ date, ...rest }: Props): Object => ({
      date: date || DATES.PREV_DAY,
      ...rest,
    })
  ),
  mapProps(
    ({ date, ...rest }: Props): Object => ({
      fetchParams: { lib_source: true, date: formatDate(date).format() },
      linkDate: formatDate(date).format(DATE_FORMATS.URL_FORMAT),
      date,
      ...rest,
    })
  ),
  patch('load', ['fetchParams', 'id']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { date, unselectAll, fetch, id }: Props = this.props;

      if (date !== nextProps.date || id !== nextProps.id) {
        unselectAll();
        fetch(nextProps.fetchParams, nextProps.id);
      }
    },
  }),
  withTabs('list'),
  titleManager(({ workflow }: Props): string => workflow.name),
  pure(['workflow', 'date', 'id', 'location']),
  unsync()
)(Workflow);
