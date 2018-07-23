// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import includes from 'lodash/includes';

import { Control, Controls } from '../../../../components/controls';
import withModal from '../../../../hocomponents/modal';
import actions from '../../../../store/api/actions';
import { ORDER_ACTIONS } from '../../../../constants/orders';
import Schedule from './modals/schedule';

type Props = {
  action: Function,
  schedule: Function,
  openModal: Function,
  closeModal: Function,
  workflowstatus: string,
  id: number,
  handleActionClick: Function,
  compact: boolean,
  availableActions: Array<string>,
};

type ControlProps = {
  action: string,
  onActionClick: Function,
  compact: boolean,
  availableActions: Array<string>,
}

const ActionButton: Function = ({
  action,
  onActionClick,
  compact,
  availableActions,
}: ControlProps): React.Element<Control> => {
  const {
    style,
    name,
    action: actionName,
    icon,
  } = ORDER_ACTIONS.ALL.find((item: Object): boolean => (
    item.action === action
  ));
  const disabled: boolean = !includes(availableActions, action);
  const handleClick: Function = (): void => {
    onActionClick(actionName);
  };

  return (
    <Control
      btnStyle={disabled ? 'default' : style}
      label={compact ? null : actionName.toUpperCase()}
      disabled={disabled}
      title={name}
      iconName={icon}
      action={handleClick}
    />
  );
};

const OrderControls: Function = ({
  workflowstatus,
  handleActionClick,
  compact,
  availableActions,
}: Props): React.Element<any> => (
  <Controls noControls grouped>
    <ActionButton
      action={workflowstatus === 'BLOCKED' ? 'unblock' : 'block'}
      onActionClick={handleActionClick}
      compact={compact}
      availableActions={availableActions}
    />
    <ActionButton
      action={workflowstatus === 'CANCELED' ? 'uncancel' : 'cancel'}
      onActionClick={handleActionClick}
      compact={compact}
      availableActions={availableActions}
    />
    <ActionButton
      action="retry"
      onActionClick={handleActionClick}
      compact={compact}
      availableActions={availableActions}
    />
    <ActionButton
      action="schedule"
      onActionClick={handleActionClick}
      compact={compact}
      availableActions={availableActions}
    />
  </Controls>
);

export default compose(
  connect(
    () => ({}),
    {
      action: actions.orders.action,
      schedule: actions.orders.schedule,
    }
  ),
  withModal(),
  mapProps(({ workflowstatus, ...rest }): Object => ({
    availableActions: ORDER_ACTIONS[workflowstatus],
    workflowstatus,
    ...rest,
  })),
  withHandlers({
    handleActionClick: ({
      action,
      openModal,
      closeModal,
      id,
      schedule,
      workflowstatus,
    }: Props): Function => (actionType: string): void => {
      if (actionType === 'schedule') {
        openModal(
          <Schedule
            onClose={closeModal}
            action={schedule}
            id={id}
            status={workflowstatus}
          />
        );
      } else {
        action(actionType, id);
      }
    },
  }),
  pure(['workflowstatus'])
)(OrderControls);
