// @flow
import React from 'react';
import TreeView from './tree';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { compose } from 'redux';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../../store/api/actions';

const DynamicView: Function = ({
  order,
  handleEditClick,
}: {
  order: Object,
  handleEditClick: Function,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<any> => (
  <TreeView
    data="dynamicdata"
    order={order}
    onEditClick={handleEditClick}
    customEdit
    withEdit
  />
);

export default compose(
  connect(
    null,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      fetchYamlData: actions.orders.fetchYamlData,
    }
  ),
  withHandlers({
    handleEditClick: ({ fetchYamlData, order }): Function => (): void => {
      fetchYamlData('Dynamic', order.id);
    },
  }),
  pure(['order'])
)(DynamicView);
