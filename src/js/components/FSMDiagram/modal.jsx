import { get } from 'lodash';
import reduce from 'lodash/reduce';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { rebuildConfigHash } from '../../helpers/interfaces';
import Box from '../box';
import ConfigItemsTable from '../ConfigItemsTable';
import Modal from '../modal';
import PipelineDiagram from '../PipelineDiagram';
import Tabs, { Pane } from '../tabs';
import Tree from '../tree';
import FSMDiagram from './';

const StateModal = ({
  onClose,
  intl,
  fsmId,
  stateId,
  fsm,
  statesPath,
  states,
}) => {
  const getConfigItemsForState = (state) => {
    state.config = reduce(
      fsm.config,
      (newConfig, configItem, name) => {
        // Split the config item name
        const [stateName, configItemName] = name.split(':');
        // Check if the name matches the state name
        if (stateName === state.id) {
          return {
            ...newConfig,
            [name]: configItem,
          };
        }

        return newConfig;
      },
      {}
    );

    return state;
  };

  const getActiveTab = () => {
    if (state.action?.type === 'pipeline') {
      return 'pipeline';
    }

    if (state.type === 'block') {
      return 'block';
    }

    if (state.type === 'fsm') {
      return 'fsm';
    }

    if (state.type === 'if') {
      return 'info';
    }

    return 'config';
  };

  const state = states[stateId];

  return (
    <Modal width="60vw" height="700">
      <Modal.Header onClose={onClose}>
        {intl.formatMessage({ id: 'global.view-state-detail' })} {state.name}
      </Modal.Header>
      <Modal.Body>
        <Box top fill>
          <Tabs active={getActiveTab()}>
            {state.type === 'fsm' ? (
              <Pane name="Fsm">
                <FSMDiagram fsmName={state.name} />
              </Pane>
            ) : null}
            {state.type === 'block' ? (
              <Pane name="Block">
                <FSMDiagram
                  states={state.states}
                  fsmId={fsmId}
                  statesPath={`${statesPath}.${stateId}.`}
                />
              </Pane>
            ) : null}
            {state.type === 'block' ? (
              <Pane name="Block config">
                <Tree data={state['block-config']} />
              </Pane>
            ) : null}
            {state.action?.type === 'pipeline' && (
              <Pane name="Pipeline">
                <br />
                <h4>{state.action.value}</h4>
                <br />
                <PipelineDiagram pipeName={state.action.value} />
              </Pane>
            )}
            {state.type !== 'if' && state.action?.type !== 'pipeline' ? (
              <Pane name="Config">
                <ConfigItemsTable
                  items={rebuildConfigHash(
                    getConfigItemsForState(state),
                    null,
                    null,
                    fsmId
                  )}
                  intrf="fsms"
                  intrfId={fsmId}
                  stateId={stateId}
                />
              </Pane>
            ) : null}
            <Pane name="Info">
              <Tree data={state} />
            </Pane>
          </Tabs>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default compose(
  connect((state, props) => ({
    fsm: state.api.fsms.data.find((fsm) => fsm.id === props.fsmId),
  })),
  mapProps(({ fsm, statesPath, ...rest }) => {
    return {
      states: get(fsm, statesPath),
      statesPath,
      fsm,
      ...rest,
    };
  }),
  injectIntl
)(StateModal);
