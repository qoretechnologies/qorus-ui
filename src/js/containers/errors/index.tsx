/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import ConfirmDialog from '../../components/confirm_dialog';
import Flex from '../../components/Flex';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import Search from '../../containers/search';
import { findBy } from '../../helpers/search';
import withModal from '../../hocomponents/modal';
import patch from '../../hocomponents/patchFuncArgs';
import withSearch from '../../hocomponents/search';
import sync from '../../hocomponents/sync';
import unsync from '../../hocomponents/unsync';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import ErrorModal from './modal';
import Table from './table';

type Props = {
  onSearchChange: Function;
  query?: string;
  title?: string;
  errors: Array<Object>;
  compact: boolean;
  type: string;
  openModal: Function;
  closeModal: Function;
  dispatchAction: Function;
  id: string | number;
  height: string | number;
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
  dispatchAction,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'optimisticDispatch' does not exist on ty... Remove this comment to see the full error message
  optimisticDispatch,
  id,
  height,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => {
  const handleFormSubmit: Function = (data: Object) => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'errors' does not exist on type '{}'.
    dispatchAction(actions.errors.createOrUpdate, type, id, data, closeModal);
  };

  const handleModalOpen: Function = (data: Object) => {
    openModal(<ErrorModal onClose={closeModal} onSubmit={handleFormSubmit} data={data} id={id} />);
  };

  const handleCreateClick: Function = () => {
    handleModalOpen({
      retry_flag: false,
      business_flag: false,
      forceworkflow: false,
    });
  };

  const handleEditClick: Function = (data) => {
    handleModalOpen(data);
  };

  const handleDeleteClick: Function = (name) => {
    const handleConfirm = (): void => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'errors' does not exist on type '{}'.
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  data: state.api.errors[props.type].data,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  sync: state.api.errors[props.type].sync,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  loading: state.api.errors[props.type].loading,
});

const querySelector: Function = (state: Object, props: Object): string =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Object... Remove this comment to see the full error message
  props.location.query[`${props.type}ErrQuery`];

const filterErrors: Function =
  (query: string): Function =>
  (collection: Array<Object>): Array<Object> =>
    findBy(['error', 'severity', 'type', 'description'], query, collection);

const errorsSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [metaSelector, querySelector],
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  (meta: Object, query: string): Array<Object> => filterErrors(query)(meta.data)
);

const selector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [metaSelector, errorsSelector],
  (meta: Object, errors: Array<Object>): Object => ({
    meta,
    errors,
  })
);

export default compose(
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'errors' does not exist on type '{}'.
    load: actions.errors.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'errors' does not exist on type '{}'.
    unsync: actions.errors.unsync,
  }),
  defaultProps({
    id: 'omit',
  }),
  patch('load', ['type', 'id']),
  sync('meta'),
  withDispatch(),
  withModal(),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  withSearch((props: Object) => `${props.type}ErrQuery`),
  unsync(),
  pure(['query', 'errors', 'compact', 'id', 'fixed', 'height'])
)(ErrorsContainer);
