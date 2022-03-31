import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../../components/loader';
import Tree from '../../../components/tree';
import actions from '../../../store/api/actions';

const dataObjects = {
  staticdata: 'Static',
  dynamicdata: 'Dynamic',
  sensitive_data: 'Sensitive',
  keys: 'Keys',
};

const TreeView = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'order' does not exist on type 'Object'.
  order,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  data,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'updateData' does not exist on type 'Obje... Remove this comment to see the full error message
  updateData,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onEditClick' does not exist on type 'Obj... Remove this comment to see the full error message
  onEditClick,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'customEdit' does not exist on type 'Obje... Remove this comment to see the full error message
  customEdit,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'editableKeys' does not exist on type 'Ob... Remove this comment to see the full error message
  editableKeys,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onKeyEditClick' does not exist on type '... Remove this comment to see the full error message
  onKeyEditClick,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'withEdit' does not exist on type 'Object... Remove this comment to see the full error message
  withEdit,
}: Object) => {
  if (!order) return <Loader />;

  const handleUpdateClick: Function = (obj: string): void => {
    updateData(dataObjects[data], obj, order.id);
  };

  return (
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    <Tree
      data={order[data]}
      withEdit={withEdit}
      onEditClick={onEditClick}
      customEdit={customEdit}
      customEditData={order.yamlData}
      onUpdateClick={handleUpdateClick}
      onKeyEditClick={onKeyEditClick}
      id={order.id}
      editableKeys={editableKeys}
      caseSensitive
      contentInline
    />
  );
};

export default connect(null, {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
  updateData: actions.orders.updateData,
})(TreeView);
