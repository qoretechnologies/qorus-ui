/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import lifecycle from 'recompose/lifecycle';
import defaultProps from 'recompose/defaultProps';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MapperDiagram from './diagram/index';
import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import actions from '../../store/api/actions';
import InfoTable from '../../components/info_table';

const MapperInfo = ({ mapperInfo }: { mapperInfo: Object }) => (
  <div>
    <InfoTable
      object={mapperInfo.data}
      pick={['name', 'desc', 'version', 'type']}
    />
    <h3>Mapper diagram:</h3>
    <MapperDiagram mapper={mapperInfo} />
  </div>
);

const stateSelector = (state, { mapperId }) => ({
  mapperInfo: state.api.mappers.data.find(item => item.mapperid === mapperId),
});

const mapperInfoSelector = createSelector(
  stateSelector,
  ({ mapperInfo }) => {
    const newMapperInfo: Object = { sync: false, loading: false };

    if (mapperInfo) {
      newMapperInfo.sync = true;
      newMapperInfo.data = mapperInfo;
    }

    return { mapperInfo: newMapperInfo };
  }
);

const reloadOnMapperIdChanged = lifecycle({
  componentWillReceiveProps(nextProps) {
    const { mapperId: nextMapperId, load } = nextProps;
    const { mapperId } = this.props;

    if (mapperId !== nextMapperId) {
      load();
    }
  },
});

export default compose(
  pure,
  connect(
    mapperInfoSelector,
    {
      load: actions.mappers.fetch,
    }
  ),
  defaultProps({ queryParams: {} }),
  patch('load', ['queryParams', 'mapperId']),
  reloadOnMapperIdChanged,
  sync('mapperInfo'),
)(MapperInfo);
