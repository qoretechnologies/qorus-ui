// @flow
import isNull from 'lodash/isNull';
import map from 'lodash/map';
import size from 'lodash/size';
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import modal from '../../hocomponents/modal';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import AddConfigItemModal from '../ConfigItemsTable/modal';
import ExpandableItem from '../ExpandableItem';
import NoDataIf from '../NoDataIf';
import Table from './table';

type GlobalConfigItemsContainerProps = {
  items: any;
  dispatchAction: Function;
  intrf: string;
  openModal: Function;
  globalItems: any;
};

const WorkflowConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'showDescription' does not exist on type ... Remove this comment to see the full error message
  showDescription,
  openModal,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Glob... Remove this comment to see the full error message
  closeModal,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intrfId' does not exist on type 'GlobalC... Remove this comment to see the full error message
  intrfId,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'globalConfig' does not exist on type 'Gl... Remove this comment to see the full error message
  globalConfig,
  globalItems,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
GlobalConfigItemsContainerProps) => {
  const saveValue = (item, newValue, onSuccess, stepId?) => {
    dispatchAction(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
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
            <ExpandableItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object[]'.
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
                          onClose={closeModal}
                          onSubmit={saveValue}
                          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                          globalConfig={globalItems}
                          isGlobal
                        />
                      );
                    }}
                  />
                </ButtonGroup>
              }
              // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object[]'.
              show={size(configItems.data) !== 0}
            >
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
    globalConfig: globalItems.filter(
      (configItem) => !isNull(configItem.value) || configItem.is_set
    ),
    globalItems: globalItems.filter((configItem) => isNull(configItem.value) && !configItem.is_set),
    ...rest,
  })),
  mapProps(({ globalConfig, ...rest }) => ({
    items: { 'Workflow Config': { data: globalConfig } },
    globalConfig,
    ...rest,
  })),
  onlyUpdateForKeys(['items', 'globalConfig', 'globalItems'])
)(WorkflowConfigItemsContainer);