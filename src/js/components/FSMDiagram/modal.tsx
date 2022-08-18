import {
  ReqoreModal,
  ReqoreModalContent,
  ReqoreTabs,
  ReqoreTabsContent,
  ReqoreTree,
} from '@qoretechnologies/reqore';
import { IReqoreTabsListItem } from '@qoretechnologies/reqore/dist/components/Tabs';
import { get } from 'lodash';
import reduce from 'lodash/reduce';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { rebuildConfigHash } from '../../helpers/interfaces';
import ConfigItemsTable from '../ConfigItemsTable';
import DataproviderSelector from '../DataproviderSelector';
import PipelineDiagram from '../PipelineDiagram';
import FSMDiagram from './';

const StateModal = ({ onClose, intl, fsmId, stateId, fsm, statesPath, states }) => {
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

    if (
      state.action?.type === 'apicall' ||
      state.action?.type === 'search-single' ||
      state.action?.type === 'search' ||
      state.action?.type === 'create' ||
      state.action?.type === 'update' ||
      state.action?.type === 'delete'
    ) {
      return 'options';
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

  const getTabs = () => {
    const tabs: IReqoreTabsListItem[] = [];

    if (state.type === 'fsm') {
      tabs.push({
        id: 'fsm',
        label: 'FSM',
      });
    }

    if (state.type === 'block') {
      tabs.push(
        {
          id: 'block',
          label: 'Block',
        },
        {
          id: 'block-config',
          label: 'Block config',
        }
      );
    }

    if (state.type === 'pipeline') {
      tabs.push({
        id: 'pipeline',
        label: 'Pipeline',
      });
    }

    if (state.type !== 'if' && state.action?.type !== 'pipeline') {
      tabs.push({
        id: 'config',
        label: 'Config',
      });
    }

    if (
      state.action?.type === 'apicall' ||
      state.action?.type === 'search-single' ||
      state.action?.type === 'search' ||
      state.action?.type === 'create' ||
      state.action?.type === 'update' ||
      state.action?.type === 'delete'
    ) {
      tabs.unshift({
        id: 'options',
        label: 'Options',
      });
    }

    tabs.push({
      id: 'info',
      label: 'Info',
    });

    return tabs;
  };

  const state = states[stateId];

  return (
    <ReqoreModal
      isOpen
      onClose={onClose}
      title={`${intl.formatMessage({ id: 'global.view-state-detail' })} ${state.name}`}
      blur={4}
    >
      <ReqoreModalContent>
        <ReqoreTabs activeTab={getActiveTab()} tabs={getTabs()} activeTabIntent="info">
          {state.type === 'fsm' ? (
            <ReqoreTabsContent tabId="fsm">
              <FSMDiagram fsmName={state.name} />
            </ReqoreTabsContent>
          ) : null}
          {state.type === 'block' ? (
            <ReqoreTabsContent tabId="block">
              <FSMDiagram
                states={state.states}
                fsmId={fsmId}
                statesPath={`${statesPath}.${stateId}.`}
              />
            </ReqoreTabsContent>
          ) : null}
          {state.type === 'block' ? (
            <ReqoreTabsContent tabId="block-config">
              <ReqoreTree data={state['block-config']} />
            </ReqoreTabsContent>
          ) : null}
          {state.action?.type === 'pipeline' && (
            <ReqoreTabsContent tabId="Pipeline">
              <br />
              <h4>{state.action.value}</h4>
              <br />
              <PipelineDiagram pipeName={state.action.value} />
            </ReqoreTabsContent>
          )}
          {state.type !== 'if' && state.action?.type !== 'pipeline' ? (
            <ReqoreTabsContent tabId="config">
              <ConfigItemsTable
                items={rebuildConfigHash(getConfigItemsForState(state), null, null, fsmId)}
                intrf="fsms"
                intrfId={fsmId}
                stateId={stateId}
              />
            </ReqoreTabsContent>
          ) : null}
          {state.action?.value ? (
            <ReqoreTabsContent tabId="options">
              <DataproviderSelector
                value={state.action.value}
                name="Options"
                readOnly
                recordType={state.action.type}
                requiresRequest={state.action.type === 'apicall'}
              />
            </ReqoreTabsContent>
          ) : null}
          <ReqoreTabsContent tabId="info">
            <ReqoreTree data={state} />
          </ReqoreTabsContent>
        </ReqoreTabs>
      </ReqoreModalContent>
    </ReqoreModal>
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
