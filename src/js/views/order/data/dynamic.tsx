// @flow
import React from 'react';
import { connect } from 'react-redux';
// @ts-ignore ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import actions from '../../../store/api/actions';
import TreeView from './tree';

const DynamicView: Function = ({
  order,
  handleEditClick,
}: {
  order: any;
  handleEditClick: Function;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) => (
  <TreeView data="dynamicdata" order={order} onEditClick={handleEditClick} customEdit withEdit />
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    fetchYamlData: actions.orders.fetchYamlData,
  }),
  withHandlers({
    handleEditClick:
      ({ fetchYamlData, order }): Function =>
      (): void => {
        fetchYamlData('Dynamic', order.id);
      },
  }),
  pure(['order'])
)(DynamicView);
