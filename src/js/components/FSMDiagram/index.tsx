import { ReqorePanel } from '@qoretechnologies/reqore';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import maxBy from 'lodash/maxBy';
import reduce from 'lodash/reduce';
import React, { useEffect, useRef, useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import TinyGrid from '../../../img/tiny_grid.png';
import modal from '../../hocomponents/modal';
import actions from '../../store/api/actions';
import DataproviderSelector from '../DataproviderSelector';
import Loader from '../loader';
import { getStateStyle } from '../PanElement/minimap';
import Spacer from '../Spacer';
import FSMDiagramWrapper from './diagramWrapper';
import StateModal from './modal';
import FSMState from './state';

export const StyledLegendItem = styled.div`
  height: 30px;
  width: 100px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: 900;
  font-size: 10px;
  letter-spacing: 1px;
  margin-right: 10px;
  display: inline-flex;
  margin-top: 10px;
  ${({ type }) => getStateStyle(type, true)};
`;

export const isStateIsolated = (
  stateKey: string,
  states: IFSMStates,
  checkedStates: string[] = []
): boolean => {
  if (states[stateKey].initial) {
    return false;
  }

  let isIsolated = true;

  forEach(states, (stateData, keyId) => {
    if (isIsolated) {
      if (
        stateData.transitions &&
        stateData.transitions.find((transition: IFSMTransition) => transition.state === stateKey)
      ) {
        // If the state already exists in the list, do not check it again
        if (!checkedStates.includes(keyId)) {
          isIsolated = isStateIsolated(keyId, states, [...checkedStates, stateKey]);
        }
      }
    }
  });

  return isIsolated;
};

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
    type: string;
  };
  errors?: string[];
}

export type TTrigger = { class?: string; connector?: string; method?: string };

export interface IFSMMetadata {
  name: string;
  desc: string;
  target_dir: string;
  fsm_options?: {
    'action-strategy': 'one' | 'all';
    'max-thread-count': number;
  };
}

export interface IFSMState {
  position?: {
    x?: number;
    y?: number;
  };
  transitions?: IFSMTransition[];
  'error-transitions'?: IFSMTransition[];
  initial?: boolean;
  final?: boolean;
  action?: {
    type: any;
    value?: string | { class: string; connector: string; prefix?: string };
  };
  'input-type'?: any;
  'output-type'?: any;
  name?: string;
  type: 'state' | 'fsm' | 'block' | 'if';
  desc: string;
}

export interface IFSMStates {
  [name: string]: IFSMState;
}

export const TOOLBAR_ITEM_TYPE: string = 'toolbar-item';
export const STATE_ITEM_TYPE: string = 'state';

export const IF_STATE_SIZE: number = 80;
export const STATE_WIDTH: number = 180;
export const STATE_HEIGHT: number = 50;
const DIAGRAM_SIZE: number = 2000;
const DIAGRAM_DRAG_KEY: string = 'Shift';

const StyledDiagramWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledDiagram = styled.div`
  width: ${DIAGRAM_SIZE}px;
  height: ${DIAGRAM_SIZE}px;
  background: ${`url(${`${TinyGrid}`})`};
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

const FSMView: React.FC<IFSMViewProps> = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'states' does not exist on type 'PropsWit... Remove this comment to see the full error message
  states,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Props... Remove this comment to see the full error message
  openModal,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Prop... Remove this comment to see the full error message
  closeModal,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'PropsWithC... Remove this comment to see the full error message
  intl,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'fsm' does not exist on type 'PropsWithCh... Remove this comment to see the full error message
  fsm,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'fsmName' does not exist on type 'PropsWi... Remove this comment to see the full error message
  fsmName,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'load' does not exist on type 'PropsWithC... Remove this comment to see the full error message
  load,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'statesPath' does not exist on type 'Prop... Remove this comment to see the full error message
  statesPath,
}) => {
  const wrapperRef = useRef(null);

  const [selectedState, setSelectedState] = useState(null);
  const [isHoldingShiftKey, setIsHoldingShiftKey] = useState(false);
  const [wrapperDimensions, setWrapperDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [openedState, setOpenedState] = useState(null);

  useEffect(() => {
    load(fsmName);
  }, [fsmName]);

  useEffect(() => {
    if (fsm) {
      const { width, height } = wrapperRef.current.getBoundingClientRect();

      setWrapperDimensions({ width, height });

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [fsm]);

  if (!fsm) {
    return <Loader />;
  }

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

  const getTransitionByState = (stateId: string, targetId: string): IFSMTransition | null => {
    const { transitions } = fsm.states[stateId];

    return transitions?.find((transition) => transition.state === targetId);
  };

  const isTransitionToSelf = (stateId: string, targetId: string): boolean => {
    return stateId === targetId;
  };

  const transitions = reduce(
    fsm.states,
    (newTransitions: any[], state: IFSMState, id: string) => {
      if (!state.transitions) {
        return newTransitions;
      }

      const stateTransitions = state.transitions.map(
        (transition: IFSMTransition, index: number) => ({
          ...transition,
          isError: !!transition.errors,
          transitionIndex: index,
          state: id,
          targetState: transition.state,
          x1: state.position.x,
          y1: state.position.y,
          x2: fsm.states[transition.state].position.x,
          y2: fsm.states[transition.state].position.y,
          order: transition.errors ? 0 : 1,
        })
      );

      return [...newTransitions, ...stateTransitions];
    },
    []
  ).sort((a, b) => a.order - b.order);

  const getXDiff = (type) => {
    return type === 'if' ? IF_STATE_SIZE / 2 : STATE_WIDTH / 2;
  };

  const getYDiff = (type) => {
    return type === 'if' ? IF_STATE_SIZE / 2 : STATE_HEIGHT / 2;
  };

  const getTargetStatePosition = (x1, y1, x2, y2, targetStateType) => {
    const modifiedX1 = x1 + 10000;
    const modifiedX2 = x2 + 10000;
    const modifiedY1 = y1 + 10000;
    const modifiedY2 = y2 + 10000;

    const sides = [];

    const horizontal = modifiedX1 - modifiedX2;
    const vertical = modifiedY1 - modifiedY2;

    if (x1 > x2) {
      sides.push({ side: 'left', value: Math.abs(horizontal) });
    } else {
      sides.push({ side: 'right', value: Math.abs(horizontal) });
    }

    if (y1 > y2) {
      sides.push({ side: 'top', value: Math.abs(vertical) });
    } else {
      sides.push({ side: 'bottom', value: Math.abs(vertical) });
    }

    const { side } = maxBy(sides, 'value');

    switch (side) {
      case 'right': {
        return {
          x2: targetStateType === 'if' ? x2 - 16 : x2,
          y2: y2 + getYDiff(targetStateType),
        };
      }
      case 'left': {
        return {
          x2: x2 + getXDiff(targetStateType) * 2 + (targetStateType === 'if' ? 16 : 0),
          y2: y2 + getYDiff(targetStateType),
        };
      }
      case 'bottom': {
        return {
          x2: x2 + getXDiff(targetStateType),
          y2: targetStateType === 'if' ? y2 - 16 : y2,
        };
      }
      case 'top': {
        return {
          x2: x2 + getXDiff(targetStateType),
          y2: y2 + getYDiff(targetStateType) * 2 + (targetStateType === 'if' ? 16 : 0),
        };
      }
      default: {
        return {
          x2: 0,
          y2: 0,
        };
      }
    }
  };

  const getTransitionEndMarker = (isError, branch) => {
    if (isError) {
      return 'error';
    }

    if (branch) {
      return branch;
    }

    return '';
  };

  const getTransitionColor = (isError, branch) => {
    if (isError || branch === 'false') {
      return 'red';
    }

    if (branch === 'true') {
      return 'green';
    }

    return '#a9a9a9';
  };

  const getStateType = (state: IFSMState) => {
    // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
    if (state.type === 'block') {
      return 'block';
    }

    if (state.type === 'fsm') {
      return 'fsm';
    }

    // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
    if (state.type === 'if') {
      return 'if';
    }

    return state.action?.type;
  };

  return (
    <>
      {openedState && <StateModal onClose={() => setOpenedState(null)} {...openedState} />}
      {fsm.input_type && (
        <DataproviderSelector
          isCollapsed
          value={fsm?.['input_type']}
          name="input_type"
          label="FSM Input type"
          readOnly
        />
      )}
      <Spacer size={10} />
      {fsm.output_type && (
        <DataproviderSelector
          isCollapsed
          value={fsm?.['output_type']}
          name="input_type"
          label="FSM Output type"
          readOnly
        />
      )}
      <Spacer size={10} />
      <ReqorePanel label="Legend" padded collapsible rounded style={{ flexShrink: 0 }}>
        <StyledLegendItem type="mapper">Mapper</StyledLegendItem>
        <StyledLegendItem type="connector">
          <span>Connector</span>
        </StyledLegendItem>
        <StyledLegendItem type="pipeline">Pipeline</StyledLegendItem>
        <StyledLegendItem type="fsm">FSM</StyledLegendItem>
        <StyledLegendItem type="block">Block</StyledLegendItem>
        <StyledLegendItem type="if">
          <span>IF</span>
        </StyledLegendItem>
        <StyledLegendItem type="apicall">API Call</StyledLegendItem>
        <StyledLegendItem type="create">Create</StyledLegendItem>
        <StyledLegendItem type="update">Update</StyledLegendItem>
        <StyledLegendItem type="search">Search</StyledLegendItem>
        <StyledLegendItem type="search-single">Single search</StyledLegendItem>
        <StyledLegendItem type="delete">Delete</StyledLegendItem>
      </ReqorePanel>

      <Spacer size={10} />
      <StyledDiagramWrapper ref={wrapperRef} id="fsm-diagram">
        <FSMDiagramWrapper
          wrapperDimensions={wrapperDimensions}
          isHoldingShiftKey
          // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; wrapperDimensions: { wi... Remove this comment to see the full error message
          items={map(fsm.states, (state) => ({
            x: state.position.x,
            y: state.position.y,
            type: getStateType(state),
          }))}
        >
          <StyledDiagram
            key={JSON.stringify(wrapperDimensions)}
            onClick={() => !isHoldingShiftKey && setSelectedState(null)}
          >
            {map(fsm.states, (state, id) => (
              <FSMState
                key={id}
                {...state}
                onClick={(id) => {
                  setOpenedState({
                    fsmId: fsm.id,
                    stateId: id,
                    statesPath: `${statesPath || ''}states`,
                  });
                }}
                id={id}
                selected={selectedState === id}
                selectedState={selectedState}
                getTransitionByState={getTransitionByState}
                isIsolated={isStateIsolated(id, fsm.states)}
              />
            ))}
            <svg height="100%" width="100%" style={{ position: 'absolute' }}>
              {transitions.map(
                ({ x1, x2, y1, y2, state, targetState, isError, transitionIndex, branch }, index) =>
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
                        stroke={getTransitionColor(isError, branch)}
                        strokeWidth={isError ? 2 : 1}
                        strokeDasharray={isError ? '10 2' : undefined}
                        markerEnd={`url(#arrowhead${getTransitionEndMarker(isError, branch)})`}
                        x1={x1 + getXDiff(fsm.states[state].type)}
                        y1={y1 + getYDiff(fsm.states[state].type)}
                        {...getTargetStatePosition(x1, y1, x2, y2, fsm.states[targetState].type)}
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

const fsmSelector: Function = (state: any, props: any): any =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.fsms.data.find((fsm: any) => fsm.name === props.fsmName);

// @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
const selector = createSelector([fsmSelector], (fsm) => ({
  fsm,
}));

export default compose(
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'fsms' does not exist on type '{}'.
    load: actions.fsms.fetch,
  }),
  mapProps(({ states, fsmId, fsm, ...rest }) => ({
    fsm: states
      ? {
          states,
          id: fsmId,
        }
      : fsm,
    ...rest,
  })),
  modal(),
  injectIntl
)(FSMView);
