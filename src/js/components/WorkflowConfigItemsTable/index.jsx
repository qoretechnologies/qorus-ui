// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import map from 'lodash/map';
import size from 'lodash/size';

import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import ExpandableItem from '../ExpandableItem';

import NoDataIf from '../NoDataIf';
import mapProps from 'recompose/mapProps';
import modal from '../../hocomponents/modal';
import Table from './table';

type GlobalConfigItemsContainerProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
  openModal: Function,
  globalItems: Object,
};

const WorkflowConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
  showDescription,
  openModal,
  closeModal,
  intrfId,
  globalConfig,
  globalItems,
}: GlobalConfigItemsContainerProps): React.Element<any> => {
  const saveValue = (item, newValue, onSuccess, stepId?) => {
    dispatchAction(
      actions.workflows.updateConfigItem,
      intrfId,
      stepId,
      item.name,
      newValue,
      onSuccess
    );
  };

  return (
    <NoDataIf condition={size(items) === 0} big>
      {() => (
        <React.Fragment>
          {map(items, (configItems: Array<Object>, belongsTo: string) => (
            <ExpandableItem title={belongsTo} key={belongsTo} show>
              {() => (
                <Table
                  globalItems={globalItems}
                  configItems={configItems}
                  intrf={intrf}
                  intrfId={intrfId}
                  saveValue={saveValue}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              )}
            </ExpandableItem>
          ))}
        </React.Fragment>
      )}
    </NoDataIf>
  );
};

export default compose(
  modal(),
  withDispatch(),
  mapProps(({ globalConfig, globalItems, ...rest }) => ({
    globalConfig: globalItems.filter(configItem => configItem.value),
    globalItems: globalItems.filter(configItem => !configItem.value),
    ...rest,
  })),
  mapProps(({ globalConfig, ...rest }) => ({
    items: { 'Workflow Config': { data: globalConfig } },
    globalConfig,
    ...rest,
  })),
  onlyUpdateForKeys(['items', 'globalConfig', 'globalItems'])
)(WorkflowConfigItemsContainer);
