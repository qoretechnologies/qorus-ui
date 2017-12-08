import React from 'react';
import { connect } from 'react-redux';

import Tree from '../../../components/tree';
import Loader from '../../../components/loader';
import actions from '../../../store/api/actions';

const dataObjects = {
  staticdata: 'Static',
  dynamicdata: 'Dynamic',
  sensitive_data: 'Sensitive',
  keys: 'Keys',
};

const TreeView = ({
  order,
  data,
  updateData,
  onEditClick,
  customEdit,
  editableKeys,
  withEdit,
}: Object) => {
  if (!order) return <Loader />;

  const handleUpdateClick: Function = (obj: string): void => {
    updateData(
      dataObjects[data],
      obj,
      order.id
    );
  };

  return (
    <Tree
      data={order[data]}
      withEdit={withEdit}
      onEditClick={onEditClick}
      customEdit={customEdit}
      customEditData={order.yamlData}
      onUpdateClick={handleUpdateClick}
      id={order.id}
      editableKeys={editableKeys}
    />
  );
};

export default connect(
  null,
  {
    updateData: actions.orders.updateData,
  }
)(TreeView);
