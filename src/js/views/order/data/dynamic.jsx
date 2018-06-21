// @flow
import React from 'react';
import TreeView from './tree';
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
