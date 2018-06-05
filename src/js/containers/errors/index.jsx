/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Intent } from '@blueprintjs/core';

import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import withModal from '../../hocomponents/modal';
import withSearch from '../../hocomponents/search';
import unsync from '../../hocomponents/unsync';
import { findBy } from '../../helpers/search';
import actions from '../../store/api/actions';
import Search from '../../containers/search';
import Toolbar from '../../components/toolbar';
import ConfirmDialog from '../../components/confirm_dialog';
import Table from './table';
import ErrorModal from './modal';

type Props = {
  onSearchChange: Function,
  query?: string,
  title?: string,
  errors: Array<Object>,
  compact: boolean,
  type: string,
  openModal: Function,
  closeModal: Function,
  createOrUpdate: Function,
  removeError: Function,
  id: string | number,
  fixed: boolean,
  height: string | number,
};

const ErrorsContainer: Function = ({
  onSearchChange,
  query,
  title,
  errors,
  compact,
  type,
  openModal,
  closeModal,
  createOrUpdate,
  removeError,
  id,
  fixed,
  height,
}: Props): React.Element<any> => {
  const handleFormSubmit: Function = (data: Object) => {
    createOrUpdate(type, id, data);
    closeModal();
  };

  const handleModalOpen: Function = (data: Object) => {
    openModal(
      <ErrorModal
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        data={data}
      />
    );
  };

  const handleCreateClick: Function = () => {
    handleModalOpen({
      retry_flag: false,
      business_flag: false,
    });
  };

  const handleEditClick: Function = data => {
    handleModalOpen(data);
  };

  const handleDeleteClick: Function = name => {
    const handleConfirm = (): void => {
      removeError(type, id, name);
      closeModal();
    };

    openModal(
      <ConfirmDialog onClose={closeModal} onConfirm={handleConfirm}>
        Are you sure you want to remove the error <strong>{name}</strong>?
      </ConfirmDialog>
    );
  };

  return (
    <div>
      <Toolbar marginBottom>
        {title && <h4 className="pull-left">{title}</h4>}
        <Search
          onSearchUpdate={onSearchChange}
          defaultValue={query}
          resource={`${type}Errors`}
        />
      </Toolbar>
      <Toolbar marginBottom>
        <Button
          className="pull-left"
          text="Add error"
          iconName="plus"
          onClick={handleCreateClick}
          intent={Intent.PRIMARY}
        />
      </Toolbar>
      <Table
        className="clear"
        type={type}
        data={errors}
        compact={compact}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        fixed={fixed}
        height={height}
      />
    </div>
  );
};

const metaSelector: Function = (state: Object, props: Object): Object => ({
  data: state.api.errors[props.type].data,
  sync: state.api.errors[props.type].sync,
  loading: state.api.errors[props.type].loading,
});

const querySelector: Function = (state: Object, props: Object): string =>
  props.location.query[`${props.type}ErrQuery`];

const filterErrors: Function = (query: string): Function => (
  collection: Array<Object>
): Array<Object> =>
  findBy(['error', 'severity', 'type', 'description'], query, collection);

const errorsSelector: Function = createSelector(
  [metaSelector, querySelector],
  (meta: Object, query: string): Array<Object> => filterErrors(query)(meta.data)
);

const selector: Function = createSelector(
  [metaSelector, errorsSelector],
  (meta: Object, errors: Array<Object>): Object => ({
    meta,
    errors,
  })
);

export default compose(
  connect(selector, {
    load: actions.errors.fetch,
    createOrUpdate: actions.errors.createOrUpdate,
    removeError: actions.errors.removeError,
    unsync: actions.errors.unsync,
  }),
  defaultProps({
    id: 'omit',
  }),
  patch('load', ['type', 'id']),
  sync('meta'),
  withModal(),
  withSearch((props: Object) => `${props.type}ErrQuery`),
  unsync(),
  pure(['query', 'errors', 'compact', 'id', 'fixed', 'height'])
)(ErrorsContainer);
