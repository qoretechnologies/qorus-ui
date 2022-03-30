// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import sync from '../../../hocomponents/sync';
import withTabs from '../../../hocomponents/withTabs';
import unsync from '../../../hocomponents/unsync';
import patch from '../../../hocomponents/patchFuncArgs';
import {
  querySelector,
  resourceSelector,
  paramSelector,
} from '../../../selectors';
import actions from '../../../store/api/actions';
import { DATES, DATE_FORMATS } from '../../../constants/dates';
import { formatDate } from '../../../helpers/workflows';
import Header from './header';
import titleManager from '../../../hocomponents/TitleManager';
import queryControl from '../../../hocomponents/queryControl';
import Flex from '../../../components/Flex';
import WorkflowDetailTabs from '../tabs';
import showIfPassed from '../../../hocomponents/show-if-passed';
import Loader from '../../../components/loader';

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
  tabQuery: string,
  searchQuery: string,
  changeSearchQuery: Function,
};

const Workflow: Function = ({
  workflow,
  date,
  location,
  linkDate,
  tabQuery,
  searchQuery,
  changeSearchQuery,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'lib' does not exist on type 'Props'.
  lib,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    <Header
      workflow={workflow}
      date={date}
      location={location}
      onSearch={changeSearchQuery}
      searchQuery={searchQuery}
      tab={tabQuery}
    />
    <WorkflowDetailTabs
      workflow={workflow}
      location={location}
      date={date}
      linkDate={linkDate}
      activeTab={tabQuery}
      lib={lib}
    />
  </Flex>
);

const workflowSelector: Function = (state: Object, props: Object): Object =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.workflows.data.find(
    (workflow: Object) =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      load: actions.workflows.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      fetch: actions.workflows.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      unsync: actions.workflows.unsync,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      unselectAll: actions.orders.unselectAll,
    }
  ),
  mapProps(({ date, ...rest }: Props): Object => ({
    date: date || DATES.PREV_DAY,
    ...rest,
  })),
  mapProps(({ date, ...rest }: Props): Object => ({
    fetchParams: { lib_source: true, date: formatDate(date).format() },
    linkDate: formatDate(date).format(DATE_FORMATS.URL_FORMAT),
    date,
    ...rest,
  })),
  patch('load', ['fetchParams', 'id']),
  sync('meta'),
  showIfPassed(({ workflow }) => workflow, <Loader />),
  mapProps((props: Object): Object =>
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
    props.workflow.code
      ? {
        ...props,
        lib: {
          ...{
            code: [
              {
                name: 'Workflow code',
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
                body: props.workflow.code,
              },
            ],
          },
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
          ...props.workflow.lib,
        },
      }
      : {
        ...props,
        lib: {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
          ...props.workflow.lib,
        },
      }
  ),
  lifecycle({
    componentWillReceiveProps (nextProps: Props) {
      const { date, unselectAll, fetch, id }: Props = this.props;

      if (date !== nextProps.date || id !== nextProps.id) {
        unselectAll();
        fetch(nextProps.fetchParams, nextProps.id);
      }
    },
  }),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('orders'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ workflow }: Props) => string'... Remove this comment to see the full error message
  titleManager(({ workflow }: Props): string => workflow.name),
  pure(['workflow', 'date', 'id', 'location', 'tabQuery', 'meta']),
  unsync()
)(Workflow);
