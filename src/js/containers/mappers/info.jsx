/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MapperDiagram from './diagram/index';
import actions from '../../store/api/actions';
import Loader from '../../components/loader';
import Alert from '../../components/alert';

const MapperInfo = ({ mapper, onBackClick }: { mapper: Object, onBackClick: Function }) => {
  if (!mapper) return <Loader />;

  return (
    <div>
      <h3 className="mapper-header">
        <a href="#" onClick={onBackClick}>
          <i className="fa fa-angle-left" />
        </a>
        {' '}
        { mapper.name }
        {' '}
        <small>({ mapper.version })</small>
      </h3>
      <p className="mapper-subtitle">{ mapper.desc }</p>
      <p className="mapper-type">
        <span> Type </span>: { mapper.type }
      </p>
      { !mapper.valid && (
        <div className="mapper-error-msg">
          <h5> Warning: This mapper contains an error and might not be rendered correctly </h5>
          <Alert bsStyle="danger">
            { mapper.error }
          </Alert>
        </div>
      )}
      <MapperDiagram mapper={mapper} />
    </div>
  );
};

const metaSelector = (state: Object): Object => state.api.mappers;
const stateSelector = (state, { mapperId }) => (
  state.api.mappers.data.find(item => item.mapperid === parseInt(mapperId, 10))
);

const mapperInfoSelector = createSelector(
  stateSelector,
  metaSelector,
  (mapper, meta) => ({
    mappers: meta,
    mapper,
  })
);

export default compose(
  pure,
  connect(
    mapperInfoSelector,
    {
      load: actions.mappers.fetch,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { load, mapperId } = this.props;

      load({}, mapperId);
    },
  }),
  withHandlers({
    onBackClick: (): Function => (ev: EventHandler): void => {
      ev.preventDefault();

      history.go(-1);
    },
  })
)(MapperInfo);
