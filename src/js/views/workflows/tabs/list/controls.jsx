// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import includes from 'lodash/includes';

import withModal from '../../../../hocomponents/modal';
import actions from '../../../../store/api/actions';
import { ORDER_ACTIONS } from '../../../../constants/orders';
import Schedule from './modals/schedule';
import withDispatch from '../../../../hocomponents/withDispatch';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../../components/controls';

type Props = {
  optimisticDispatch: Function,
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
};

const ActionButton: Function = ({
  action,
  onActionClick,
  compact,
  availableActions,
}: ControlProps): React.Element<Button> => {
  const { name, action: actionName, icon, intent } = ORDER_ACTIONS.ALL.find(
    (item: Object): boolean => item.action === action
  );
  const disabled: boolean = !includes(availableActions, action);
  const handleClick: Function = (): void => {
    onActionClick(actionName);
  };

  return (
    <Button
      disabled={disabled}
      title={name}
      iconName={icon}
      onClick={handleClick}
      btnStyle={intent}
      big={!compact}
    />
  );
};

const OrderControls: Function = ({
  workflowstatus,
  handleActionClick,
  compact,
  availableActions,
}: Props): React.Element<any> => (
  <ButtonGroup>
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
  </ButtonGroup>
);

export default compose(
  withDispatch(),
  withModal(),
  mapProps(
    ({ workflowstatus, ...rest }): Object => ({
      availableActions: ORDER_ACTIONS[workflowstatus],
      workflowstatus,
      ...rest,
    })
  ),
  withHandlers({
    handleActionClick: ({
      optimisticDispatch,
      openModal,
      closeModal,
      id,
      workflowstatus,
    }: Props): Function => (actionType: string): void => {
      if (actionType === 'schedule') {
        openModal(
          <Schedule
            onClose={closeModal}
            action={optimisticDispatch}
            id={id}
            status={workflowstatus}
          />
        );
      } else {
        optimisticDispatch(actions.orders.action, actionType, id);
      }
    },
  }),
  pure(['workflowstatus'])
)(OrderControls);
