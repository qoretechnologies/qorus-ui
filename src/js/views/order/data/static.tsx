// @flow
import React from 'react';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
// @ts-ignore ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { compose } from 'redux';
import actions from '../../../store/api/actions';
import TreeView from './tree';

const StaticView: Function = ({
  order,
  handleEditClick,
}: {
  order: Object;
  handleEditClick: Function;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<any> => (
  <TreeView data="staticdata" order={order} onEditClick={handleEditClick} customEdit withEdit />
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
        fetchYamlData('Static', order.id);
      },
  }),
  pure(['order'])
)(StaticView);
