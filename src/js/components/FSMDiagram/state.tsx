import size from 'lodash/size';
import React from 'react';
import styled, { css } from 'styled-components';
import { getStateStyle } from '../PanElement/minimap';
import { IFSMState, IF_STATE_SIZE, STATE_HEIGHT, STATE_WIDTH } from './';

export interface IFSMStateProps extends IFSMState {
  selected?: boolean;
  onDblClick: (id: string) => any;
  onClick: (id: string) => any;
  onEditClick: (id: string) => any;
  onDeleteClick: (id: string) => any;
  onUpdate: (id: string, data: any) => any;
  startTransitionDrag: (id: string) => any;
  stopTransitionDrag: (id: string) => any;
  selectedState?: boolean;
  getTransitionByState: (stateId: string, id: string) => boolean;
  id: string;
}

const StyledStateName = styled.p`
  padding: 0;
  margin: 0;
  font-weight: 500;
  text-align: center;
`;

const StyledStateAction = styled.p`
  padding: 0;
  margin: 0;
  color: #a9a9a9;
  font-size: 12px;
`;

export const StyledStateTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

const StyledFSMState = styled.div`
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  position: absolute;
  width: ${({ type }) => (type === 'if' ? IF_STATE_SIZE : STATE_WIDTH)}px;
  height: ${({ type }) => (type === 'if' ? IF_STATE_SIZE : STATE_HEIGHT)}px;
  background-color: #fff;
  z-index: 9;
  border: 1px solid;
  transition: all 0.2s linear;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  ${StyledStateName}, ${StyledStateAction} {
    opacity: ${({ isIsolated }) => (isIsolated ? 0.4 : 1)};
  }

  ${({ selected, initial }) => {
    let color: string = '#a9a9a9';

    if (selected) {
      color = '#277fba';
    } else if (initial) {
      color = '#7fba27';
    }

    return css`
      border-color: ${color};
      border-style: solid;

      &:hover {
        box-shadow: 0 0 5px 0px ${color};
      }
    `;
  }};

  ${({ type }) => getStateStyle(type)}
`;

export const getStateType = ({ type, action, ...rest }: IFSMState) => {
  // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
  if (type === 'block') {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'states' does not exist on type '{ positi... Remove this comment to see the full error message
    return `${rest['block-type'] || 'for'} block (${size(rest.states)})`;
  }

  if (type === 'fsm') {
    return `fsm`;
  }

  // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
  if (type === 'if') {
    return `if statement`;
  }

  if (!action || !action.type || !action.value) {
    return '';
  }

  return `${
    // @ts-ignore ts-migrate(2339) FIXME: Property 'class' does not exist on type 'string | ... Remove this comment to see the full error message
    action.value.class
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'class' does not exist on type 'string | ... Remove this comment to see the full error message
        `${action.value.class}:${action.value.connector}`
      : action.value
  } ${action.type}`;
};

const FSMState: React.FC<IFSMStateProps> = ({
  position,
  id,
  selected,
  onClick,
  onDblClick,
  onEditClick,
  onDeleteClick,
  name,
  action,
  initial,
  final,
  type,
  onUpdate,
  selectedState,
  getTransitionByState,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isIsolated' does not exist on type 'Prop... Remove this comment to see the full error message
  isIsolated,
  // @ts-ignore ts-migrate(1013) FIXME: A rest parameter or binding pattern may not have a... Remove this comment to see the full error message
  ...rest
}) => {
  const calculateFontSize = (isAction) => {
    const len = name.length;

    if (len > 20) {
      return isAction ? '8px' : '12px';
    }

    return undefined;
  };

  return (
    <StyledFSMState
      key={id}
      x={position.x}
      y={position.y}
      onClick={() => onClick(id)}
      selected={selected}
      initial={initial}
      isIsolated={isIsolated}
      type={action?.type || type}
    >
      <StyledStateTextWrapper>
        {/* @ts-ignore ts-migrate(2554) FIXME: Expected 1 arguments, but got 0. */}
        <StyledStateName style={{ fontSize: calculateFontSize() }}>{name}</StyledStateName>
        <StyledStateAction style={{ fontSize: calculateFontSize(true) }}>
          {getStateType({ type, action, ...rest })}
        </StyledStateAction>
      </StyledStateTextWrapper>
    </StyledFSMState>
  );
};

export default FSMState;
