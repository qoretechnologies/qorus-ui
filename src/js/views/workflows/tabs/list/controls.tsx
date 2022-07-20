// @flow
import includes from 'lodash/includes';
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Control as Button, Controls as ButtonGroup } from '../../../../components/controls';
import { ORDER_ACTIONS } from '../../../../constants/orders';
import withModal from '../../../../hocomponents/modal';
import withDispatch from '../../../../hocomponents/withDispatch';
import actions from '../../../../store/api/actions';
import Schedule from './modals/schedule';

type Props = {
  optimisticDispatch: Function;
  openModal: Function;
  closeModal: Function;
  workflowstatus: string;
  id: number;
  handleActionClick: Function;
  compact: boolean;
  availableActions: Array<string>;
};

type ControlProps = {
  action: string;
  onActionClick: Function;
  compact: boolean;
  availableActions: Array<string>;
};

const ActionButton: Function = ({
  action,
  onActionClick,
  compact,
  availableActions,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ControlProps) => {
  const {
    name,
    action: actionName,
    icon,
    intent,
  } = ORDER_ACTIONS.ALL.find(
    // @ts-ignore ts-migrate(2339) FIXME: Property 'action' does not exist on type 'Object'.
    (item: any): boolean => item.action === action
  );
  const disabled: boolean = !includes(availableActions, action);
  const handleClick: Function = (): void => {
    onActionClick(actionName);
  };

  return (
    <Button
      disabled={disabled}
      title={name}
      icon={icon}
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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
  mapProps(({ workflowstatus, ...rest }): any => ({
    availableActions: ORDER_ACTIONS[workflowstatus],
    workflowstatus,
    ...rest,
  })),
  withHandlers({
    handleActionClick:
      ({ optimisticDispatch, openModal, closeModal, id, workflowstatus }: Props): Function =>
      (actionType: string): void => {
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
          // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
          optimisticDispatch(actions.orders.action, actionType, id);
        }
      },
  }),
  pure(['workflowstatus'])
)(OrderControls);
