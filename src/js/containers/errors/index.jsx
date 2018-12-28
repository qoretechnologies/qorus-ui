/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';

import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import withModal from '../../hocomponents/modal';
import withSearch from '../../hocomponents/search';
import unsync from '../../hocomponents/unsync';
import withDispatch from '../../hocomponents/withDispatch';
import { findBy } from '../../helpers/search';
import actions from '../../store/api/actions';
import Search from '../../containers/search';
import ConfirmDialog from '../../components/confirm_dialog';
import Table from './table';
import ErrorModal from './modal';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Box from '../../components/box';
import Pull from '../../components/Pull';
import Headbar from '../../components/Headbar';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import Flex from '../../components/Flex';

type Props = {
  onSearchChange: Function,
  query?: string,
  title?: string,
  errors: Array<Object>,
  compact: boolean,
  type: string,
  openModal: Function,
  closeModal: Function,
  optimisticDispatch: Function,
  id: string | number,
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
  optimisticDispatch,
  id,
  height,
}: Props): React.Element<any> => {
  console.log(id);

  const handleFormSubmit: Function = (data: Object) => {
    optimisticDispatch(actions.errors.createOrUpdate, type, id, data);
    closeModal();
  };

  const handleModalOpen: Function = (data: Object) => {
    openModal(
      <ErrorModal
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        data={data}
        id={id}
      />
    );
  };

  const handleCreateClick: Function = () => {
    handleModalOpen({
      retry_flag: false,
      business_flag: false,
      forceworkflow: false,
    });
  };

  const handleEditClick: Function = data => {
    handleModalOpen(data);
  };

  const handleDeleteClick: Function = name => {
    const handleConfirm = (): void => {
      optimisticDispatch(actions.errors.removeError, type, id, name);
      closeModal();
    };

    openModal(
      <ConfirmDialog onClose={closeModal} onConfirm={handleConfirm}>
        Are you sure you want to remove the error <strong>{name}</strong>?
      </ConfirmDialog>
    );
  };

  return (
    <Flex>
      {title && (
        <Headbar>
          <Breadcrumbs icon={compact && 'error'}>
            <Crumb active>{title}</Crumb>
          </Breadcrumbs>
          <Pull right>
            <Search
              onSearchUpdate={onSearchChange}
              defaultValue={query}
              resource={`${type}Errors`}
            />
          </Pull>
        </Headbar>
      )}
      {compact ? (
        <Table
          type={type}
          data={errors}
          compact={compact}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onCreateClick={handleCreateClick}
          height={height}
        />
      ) : (
        <Box top noPadding>
          <Table
            type={type}
            data={errors}
            compact={compact}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onCreateClick={handleCreateClick}
            height={height}
          />
        </Box>
      )}
    </Flex>
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
  connect(
    selector,
    {
      load: actions.errors.fetch,
      unsync: actions.errors.unsync,
    }
  ),
  defaultProps({
    id: 'omit',
  }),
  patch('load', ['type', 'id']),
  sync('meta'),
  withDispatch(),
  withModal(),
  withSearch((props: Object) => `${props.type}ErrQuery`),
  unsync(),
  pure(['query', 'errors', 'compact', 'id', 'fixed', 'height'])
)(ErrorsContainer);
