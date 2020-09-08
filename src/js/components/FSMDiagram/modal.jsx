import React from 'react';

import reduce from 'lodash/reduce';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { rebuildConfigHash } from '../../helpers/interfaces';
import Box from '../box';
import ConfigItemsTable from '../ConfigItemsTable';
import Modal from '../modal';
import PipelineDiagram from '../PipelineDiagram';
import Tabs, { Pane } from '../tabs';
import Tree from '../tree';

const StateModal = ({ onClose, intl, fsmId, stateId, fsm }) => {
  const getConfigItemsForState = (state) => {
    state.config = reduce(
      fsm.config,
      (newConfig, configItem, name) => {
        // Split the config item name
        const [stateName, configItemName] = name.split(':');
        // Check if the name matches the state name
        if (stateName === state.name) {
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

  const state = fsm.states[stateId];

  return (
    <Modal width="60vw" height="700">
      <Modal.Header onClose={onClose}>
        {intl.formatMessage({ id: 'global.view-state-detail' })} {state.name}
      </Modal.Header>
      <Modal.Body>
        <Box top fill>
          <Tabs
            active={state.action.type === 'pipeline' ? 'pipeline' : 'config'}
          >
            {state.action.type === 'pipeline' && (
              <Pane name="Pipeline">
                <br />
                <h4>{state.action.value}</h4>
                <br />
                <PipelineDiagram pipeName={state.action.value} />
              </Pane>
            )}
            <Pane name="Config">
              <ConfigItemsTable
                items={rebuildConfigHash(getConfigItemsForState(state))}
                intrf="fsms"
                intrfId={fsmId}
                stateId={stateId}
              />
            </Pane>
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
  injectIntl
)(StateModal);
