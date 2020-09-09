import React from 'react';

import styled, {
  css, keyframes
} from 'styled-components';

import { getStateStyle } from '../PanElement/minimap';
import { IFSMState } from './';

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

const wiggleAnimation = (type) => keyframes`
    0% {
        transform: rotate(-2deg) ${type === 'connector' ? 'skew(15deg)' : ''};
    }

    50% {
        transform: rotate(2deg) ${type === 'connector' ? 'skew(15deg)' : ''};
    }

    100% {
        transform: rotate(-2deg) ${type === 'connector' ? 'skew(15deg)' : ''};
    }
`;

const StyledFSMState = styled.div`
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  position: absolute;
  width: 180px;
  height: 50px;
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

  ${({ selected, initial, final }) => {
    let color: string = '#a9a9a9';

    if (selected) {
      color = '#277fba';
    } else if (final) {
      color = '#81358a';
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
}) => {
  const calculateFontSize = (isAction) => {
    const len = name.length;

    if (len > 20) {
      return isAction ? '10px' : '12px';
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
      final={final}
      isAvailableForTransition={
        selectedState ? !getTransitionByState(selectedState, id) : false
      }
      type={type === 'fsm' ? 'fsm' : type === 'block' ? 'block' : action?.type}
    >
      <StyledStateName style={{ fontSize: calculateFontSize() }}>
        {name}
      </StyledStateName>
      {action && (
        <StyledStateAction style={{ fontSize: calculateFontSize(true) }}>
          {action.type}
        </StyledStateAction>
      )}
    </StyledFSMState>
  );
};

export default FSMState;
