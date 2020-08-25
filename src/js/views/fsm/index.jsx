import React, {
  useRef, useState
} from 'react';

import map from 'lodash/map';
import reduce from 'lodash/reduce';
import useMount from 'react-use/lib/useMount';
import styled from 'styled-components';

import FSMDiagramWrapper from './diagramWrapper';
import FSMState from './state';

export interface IFSMViewProps {
  onSubmitSuccess: (data: any) => any;
  setFsmReset: () => void;
}

export interface IDraggableItem {
  type: 'toolbar-item' | 'state';
  name: 'fsm' | 'state';
  id?: number;
  stateType?: any;
}

export interface IFSMTransition {
  state?: string;
  fsm?: number;
  condition?: {
    type: string,
  };
  errors?: string[];
}

export type TTrigger = { class?: string, connector?: string, method?: string };

export interface IFSMMetadata {
  name: string;
  desc: string;
  target_dir: string;
  fsm_options?: {
    'action-strategy': 'one' | 'all',
    'max-thread-count': number,
  };
}

export interface IFSMState {
  position?: {
    x?: number,
    y?: number,
  };
  transitions?: IFSMTransition[];
  'error-transitions'?: IFSMTransition[];
  initial?: boolean;
  final?: boolean;
  action?: {
    type: any,
    value?: string | { class: string, connector: string, prefix?: string },
  };
  'input-type'?: any;
  'output-type'?: any;
  name?: string;
  type: 'state' | 'fsm';
  desc: string;
}

export interface IFSMStates {
  [name: string]: IFSMState;
}

export const TOOLBAR_ITEM_TYPE: string = 'toolbar-item';
export const STATE_ITEM_TYPE: string = 'state';

const DIAGRAM_SIZE: number = 2000;
const DIAGRAM_DRAG_KEY: string = 'Shift';
const DROP_ACCEPTS: string[] = [TOOLBAR_ITEM_TYPE, STATE_ITEM_TYPE];

const StyledToolbarWrapper = styled.div`
  margin-bottom: 10px;
`;

const StyledDiagramWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledDiagram = styled.div`
  width: ${DIAGRAM_SIZE}px;
  height: ${DIAGRAM_SIZE}px;
  background: ${({ path }) => `url(${`${path}/images/tiny_grid.png`})`};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 10px 10px 80px -50px red, inset -10px -10px 80px -50px red;
`;

const StyledFSMLine = styled.line`
  transition: all 0.2s linear;
  cursor: pointer;

  &:hover {
    stroke-width: 6;
  }
`;

const StyledFSMCircle = styled.circle`
  transition: all 0.2s linear;
  cursor: pointer;

  &:hover {
    stroke-width: 6;
  }
`;

let currentXPan: number;
let currentYPan: number;

const FSMView: React.FC<IFSMViewProps> = ({
  onSubmitSuccess,
  setFsmReset,
  interfaceContext,
  states,
}) => {
  const wrapperRef = useRef(null);
  const fieldsWrapperRef = useRef(null);

  const [selectedState, setSelectedState] = useState(null);
  const [isHoldingShiftKey, setIsHoldingShiftKey] = useState(false);
  const [wrapperDimensions, setWrapperDimensions] = useState({
    width: 0,
    height: 0,
  });

  useMount(() => {
    const { width, height } = wrapperRef.current.getBoundingClientRect();

    currentXPan = 1000 - width / 2;
    currentYPan = 1000 - height / 2;

    setWrapperDimensions({ width, height });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === DIAGRAM_DRAG_KEY) {
      setIsHoldingShiftKey(true);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === DIAGRAM_DRAG_KEY) {
      setIsHoldingShiftKey(false);
    }
  };

  const setWrapperPan = (x, y) => {
    currentXPan = x;
    currentYPan = y;
  };

  const getTransitionByState = (
    stateId: string,
    targetId: string
  ): IFSMTransition | null => {
    const { transitions } = states[stateId];

    return transitions?.find((transition) => transition.state === targetId);
  };

  const hasBothWayTransition = (
    stateId: string,
    targetId: string
  ): { stateId: string, index: number } => {
    const transitionIndex = states[targetId].transitions?.findIndex(
      (transition) => transition.state === stateId
    );

    if (transitionIndex >= 0) {
      return { stateId: targetId, index: transitionIndex };
    }

    return null;
  };

  const isTransitionToSelf = (stateId: string, targetId: string): boolean => {
    return stateId === targetId;
  };

  const transitions = reduce(
    states,
    (newTransitions: any[], state: IFSMState, id: string) => {
      if (!state.transitions) {
        return newTransitions;
      }

      const stateTransitions = state.transitions.map(
        (transition: IFSMTransition, index: number) => ({
          isError: !!transition.errors,
          transitionIndex: index,
          state: id,
          targetState: transition.state,
          x1: state.position.x,
          y1: state.position.y,
          x2: states[transition.state].position.x,
          y2: states[transition.state].position.y,
          order: transition.errors ? 0 : 1,
        })
      );

      return [...newTransitions, ...stateTransitions];
    },
    []
  ).sort((a, b) => a.order - b.order);

  const { width = 0, height = 0 } =
    wrapperRef?.current?.getBoundingClientRect() || {};

  return (
    <>
      <StyledDiagramWrapper ref={wrapperRef} id="fsm-diagram">
        <FSMDiagramWrapper
          wrapperDimensions={wrapperDimensions}
          setPan={setWrapperPan}
          isHoldingShiftKey={isHoldingShiftKey}
          items={map(states, (state) => ({
            x: state.position.x,
            y: state.position.y,
          }))}
        >
          <StyledDiagram
            key={JSON.stringify(wrapperDimensions)}
            onClick={() => !isHoldingShiftKey && setSelectedState(null)}
          >
            {map(states, (state, id) => (
              <FSMState
                key={id}
                {...state}
                id={id}
                selected={selectedState === id}
                selectedState={selectedState}
                getTransitionByState={getTransitionByState}
              />
            ))}
            <svg height="100%" width="100%" style={{ position: 'absolute' }}>
              {transitions.map(
                (
                  {
                    x1,
                    x2,
                    y1,
                    y2,
                    state,
                    targetState,
                    isError,
                    transitionIndex,
                  },
                  index
                ) =>
                  isTransitionToSelf(state, targetState) ? (
                    <StyledFSMCircle
                      cx={x1 + 90}
                      cy={y1 + 50}
                      r={25}
                      fill="transparent"
                      stroke={isError ? 'red' : '#a9a9a9'}
                      strokeWidth={2}
                      strokeDasharray={isError ? '10 2' : undefined}
                      key={index}
                    />
                  ) : (
                    <>
                      <StyledFSMLine
                        key={index}
                        stroke={isError ? 'red' : '#a9a9a9'}
                        strokeWidth={isError ? 4 : 2}
                        strokeDasharray={isError ? '10 2' : undefined}
                        markerEnd={
                          isError ? 'url(#arrowheaderror)' : 'url(#arrowhead)'
                        }
                        x1={x1 + 90}
                        y1={y1 + 25}
                        {...getTargetStatePosition(x1, y1, x2, y2)}
                      />
                    </>
                  )
              )}
            </svg>
          </StyledDiagram>
        </FSMDiagramWrapper>
      </StyledDiagramWrapper>
    </>
  );
};

export default FSMView;
