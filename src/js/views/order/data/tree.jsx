import React from 'react';
import { connect } from 'react-redux';

import Tree from 'components/tree';
import Loader from 'components/loader';
import actions from '../../../store/api/actions';

const dataObjects = {
  staticdata: 'staticData',
  dynamicdata: 'dynamicData',
  keys: 'updateKeys',
};

const TreeView = ({ order, data, updateData }: Object) => {
  if (!order) return <Loader />;

  const handleUpdateClick: Function = (obj: string): void => {
    updateData(
      dataObjects[data],
      JSON.parse(obj),
      order.id
    );
  };

  return (
    <Tree data={order[data]} withEdit onUpdateClick={handleUpdateClick} />
  );
};

export default connect(
  null,
  {
    updateData: actions.orders.updateData,
  }
)(TreeView);
