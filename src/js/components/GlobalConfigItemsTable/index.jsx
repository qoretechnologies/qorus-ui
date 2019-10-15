// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import map from 'lodash/map';
import size from 'lodash/size';
import isNull from 'lodash/isNull';

import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import ExpandableItem from '../ExpandableItem';

import NoDataIf from '../NoDataIf';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import modal from '../../hocomponents/modal';
import Table from './table';
import AddConfigItemModal from '../ConfigItemsTable/modal';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
type GlobalConfigItemsContainerProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
  openModal: Function,
  globalItems: Object,
};

const GlobalConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
  showDescription,
  openModal,
  closeModal,
  intrfId,
  globalConfig,
  globalItems,
  isGlobal,
}: GlobalConfigItemsContainerProps): React.Element<any> => {
  const saveValue = (item, newValue, onSuccess, stepId?) => {
    dispatchAction(
      actions.system.updateConfigItem,
      item.id,
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
          {map(items, (configItems: Array<Object>, belongsTo: string) =>
            isGlobal ? (
              <Table
                globalItems={globalItems}
                configItems={configItems}
                intrf={intrf}
                saveValue={saveValue}
                openModal={openModal}
                closeModal={closeModal}
              />
            ) : (
              <ExpandableItem
                title={`${belongsTo} (${size(configItems.data)})`}
                key={belongsTo}
                label={
                  <ButtonGroup>
                    <Button
                      disabled={!size(globalItems)}
                      icon="add"
                      label="Add new"
                      title="Add new"
                      onClick={() => {
                        openModal(
                          <AddConfigItemModal
                            isGlobal
                            onClose={closeModal}
                            onSubmit={saveValue}
                            globalConfig={globalItems}
                          />
                        );
                      }}
                    />
                  </ButtonGroup>
                }
                show={size(configItems.data) !== 0}
              >
                {() => (
                  <Table
                    globalItems={globalItems}
                    configItems={configItems}
                    intrf={intrf}
                    saveValue={saveValue}
                    openModal={openModal}
                    closeModal={closeModal}
                  />
                )}
              </ExpandableItem>
            )
          )}
        </React.Fragment>
      )}
    </NoDataIf>
  );
};

export default compose(
  connect((state: Object) => ({
    globalConfig: state.api.system.globalConfig,
  })),
  modal(),
  withDispatch(),
  mapProps(({ globalConfig, globalItems, ...rest }) => ({
    globalConfig: globalConfig
      .filter(configItem =>
        includes(
          globalItems ? Object.keys(globalItems) : [],
          configItem.name || configItem.item
        )
      )
      .filter(configItem => !isNull(configItem.value) || configItem.is_set),
    globalItems: globalConfig
      .filter(configItem =>
        includes(
          globalItems ? Object.keys(globalItems) : [],
          configItem.name || configItem.item
        )
      )
      .filter(configItem => isNull(configItem.value) && !configItem.is_set),
    ...rest,
  })),
  mapProps(({ globalConfig, ...rest }) => ({
    items: { 'Global Config': { data: globalConfig } },
    globalConfig,
    ...rest,
  })),
  onlyUpdateForKeys(['items', 'globalConfig', 'globalItems'])
)(GlobalConfigItemsContainer);
