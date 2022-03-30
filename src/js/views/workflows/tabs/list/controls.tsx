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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: ControlProps): React.Element<Button> => {
  const { name, action: actionName, icon, intent } = ORDER_ACTIONS.ALL.find(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'action' does not exist on type 'Object'.
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
        optimisticDispatch(actions.orders.action, actionType, id);
      }
    },
  }),
  pure(['workflowstatus'])
)(OrderControls);
