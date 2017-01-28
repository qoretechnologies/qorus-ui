// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import sync from '../../hocomponents/sync';
import unsync from '../../hocomponents/unsync';
import patch from '../../hocomponents/patchFuncArgs';
import { querySelector, resourceSelector, paramSelector } from '../../selectors';
import actions from '../../store/api/actions';
import { DATES, DATE_FORMATS } from '../../constants/dates';
import { formatDate } from '../../helpers/workflows';
import Header from './header';
import Nav, { NavLink } from '../../components/navlink';

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
};

const Workflow: Function = ({
  workflow,
  date,
  location,
  children,
  linkDate,
}: Props): React.Element<any> => (
  <div>
    <Header
      {...workflow}
      date={date}
    />
    <div className="row">
      <div className="col-xs-12">
        <Nav path={location.pathname}>
          <NavLink to="./list">Orders</NavLink>
          <NavLink to="./performance">Performance</NavLink>
          <NavLink to="./log">Log</NavLink>
          <NavLink to="./code">Code</NavLink>
          <NavLink to="./info">Info</NavLink>
          <NavLink to="./mappers">Mappers</NavLink>
        </Nav>
      </div>
    </div>
    <div className="row tab-pane">
      <div className="col-xs-12">
        {React.cloneElement(
          children,
          {
            createElement: (Comp, props) => (
              <Comp
                {...{
                  ...props,
                  workflow,
                  date,
                  linkDate,
                  location,
                }}
              />
            ),
          }
        )}
      </div>
    </div>
  </div>
);

const workflowSelector: Function = (state: Object, props: Object): Object => (
  state.api.workflows.data.find((workflow: Object) => (
    parseInt(props.params.id, 10) === parseInt(workflow.id, 10)
  ))
);

const selector: Object = createSelector(
  [
    resourceSelector('workflows'),
    workflowSelector,
    querySelector('date'),
    paramSelector('id'),
  ], (meta, workflow, date, id) => ({
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
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { date, unselectAll, fetch, id }: Props = this.props;

      if (date !== nextProps.date || id !== nextProps.id) {
        unselectAll();
        fetch(nextProps.fetchParams, nextProps.id);
      }
    },
  }),
  pure([
    'workflow',
    'date',
    'id',
    'location',
  ]),
  unsync()
)(Workflow);
