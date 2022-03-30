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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'showDescription' does not exist on type ... Remove this comment to see the full error message
  showDescription,
  openModal,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Glob... Remove this comment to see the full error message
  closeModal,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intrfId' does not exist on type 'GlobalC... Remove this comment to see the full error message
  intrfId,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'globalConfig' does not exist on type 'Gl... Remove this comment to see the full error message
  globalConfig,
  globalItems,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isGlobal' does not exist on type 'Global... Remove this comment to see the full error message
  isGlobal,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: GlobalConfigItemsContainerProps): React.Element<any> => {
  const saveValue = (item, newValue, onSuccess, stepId?) => {
    dispatchAction(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
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
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object[]'.
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
                            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                            globalConfig={globalItems}
                          />
                        );
                      }}
                    />
                  </ButtonGroup>
                }
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object[]'.
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
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
