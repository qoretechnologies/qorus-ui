// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import moment from 'moment';

import Nav, { NavLink } from '../../../../components/navlink';
import patch from '../../../../hocomponents/patchFuncArgs';
import sync from '../../../../hocomponents/sync';
import unsync from '../../../../hocomponents/unsync';
import actions from '../../../../store/api/actions';
import queryControl from '../../../../hocomponents/queryControl';
import { resourceSelector } from '../../../../selectors';
import { DATE_FORMATS } from '../../../../constants/dates';

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
};

const SLADetail: Function = ({
  location,
  children,
  params,
  sla,
  minDate,
  maxDate,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <h3 className="detail-title">
      {sla.name}
      {' '}
      <small>({sla.slaid})</small>
      {' '}
      <small>"{sla.description}"</small>
    </h3>
    <Nav
      path={location.pathname}
      type="nav-pills"
    >
      <NavLink to={`./events?minDate=${minDate}&maxDate=${maxDate}`}>Events</NavLink>
      <NavLink to={`./sources?minDate=${minDate}&maxDate=${maxDate}`}>Event Sources</NavLink>
      <NavLink to={`./perf?minDate=${minDate}&maxDate=${maxDate}`}>Performance</NavLink>
    </Nav>
    <div className="tab-content">
      {React.cloneElement(
        children,
        {
          createElement: (Comp, props) => (
            <Comp
              {...{
                ...props,
                location,
                params,
                sla,
              }}
            />
          ),
        }
      )}
    </div>
  </div>
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('slas'),
  ], (meta: Object): Object => ({
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
  mapProps(({ params, data, minDateQuery, maxDateQuery, ...rest }: Props): Props => ({
    id: params.id,
    params,
    fetchParams: null,
    sla: data.length ? data[0] : {},
    data,
    minDate: !minDateQuery || minDateQuery === '' ?
      moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT) :
      minDateQuery,
    maxDate: !maxDateQuery || maxDateQuery === '' ?
      '' :
      maxDateQuery,
    ...rest,
  })),
  patch('load', ['fetchParams', 'id']),
  sync('meta'),
  pure(['location', 'children']),
  unsync(),
)(SLADetail);
