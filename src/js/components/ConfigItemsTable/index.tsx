// @flow
import map from 'lodash/map';
import size from 'lodash/size';
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import modal from '../../hocomponents/modal';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import ExpandableItem from '../ExpandableItem';
import NoDataIf from '../NoDataIf';
import Table from './table';

type ConfigItemsContainerProps = {
  items: any;
  dispatchAction: Function;
  intrf: string;
  openModal: Function;
  stepId?: number;
};

const intrfToLevelType = {
  workflows: 'step',
  services: 'service',
  jobs: 'job',
};

let ExpandableConfigWrapper = ({
  intrf,
  openModal,
  closeModal,
  intrfId,
  stepId,
  belongsTo,
  configItems,
  isGrouped,
  saveValue,
  setGrouped,
  intl,
}) => (
  <ExpandableItem
    title={`${belongsTo} (${size(configItems.data)})`}
    key={belongsTo}
    label={
      size(configItems.data)
        ? [
            {
              label: intl.formatMessage({
                id: isGrouped ? 'button.show-un-grouped' : 'button.show-grouped',
              }),
              onClick: () => setGrouped(!isGrouped),
              icon: isGrouped ? 'GroupLine' : 'Separator',
            },
          ]
        : null
    }
    show
  >
    {() => (
      <Table
        configItems={configItems}
        belongsTo={belongsTo}
        intrf={intrf}
        levelType={intrfToLevelType[intrf]}
        saveValue={saveValue}
        openModal={openModal}
        closeModal={closeModal}
        stepId={stepId}
        intrfId={intrfId}
        isGrouped={isGrouped}
      />
    )}
  </ExpandableItem>
);

ExpandableConfigWrapper = compose(
  withState('isGrouped', 'setGrouped', true),
  injectIntl
)(ExpandableConfigWrapper);

const ConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'showDescription' does not exist on type ... Remove this comment to see the full error message
  showDescription,
  openModal,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Conf... Remove this comment to see the full error message
  closeModal,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intrfId' does not exist on type 'ConfigI... Remove this comment to see the full error message
  intrfId,
  stepId,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ConfigItemsContainerProps) => {
  const saveValue = (item, newValue, onSuccess, newStepId?) => {
    dispatchAction(
      actions[intrf].updateConfigItem,
      item.id || intrfId,
      newStepId || stepId,
      item.name,
      newValue,
      onSuccess
    );
  };

  return (
    <NoDataIf condition={size(items) === 0}>
      {() => (
        <React.Fragment>
          {map(items, (configItems: Array<Object>, belongsTo: string) => (
            // @ts-ignore ts-migrate(2739) FIXME: Type '{ configItems: any[]; belongsTo: string; ... Remove this comment to see the full error message
            <ExpandableConfigWrapper
              configItems={configItems}
              belongsTo={belongsTo}
              intrf={intrf}
              saveValue={saveValue}
              openModal={openModal}
              closeModal={closeModal}
              stepId={stepId}
              intrfId={intrfId}
            />
          ))}
        </React.Fragment>
      )}
    </NoDataIf>
  );
};

export default compose(
  modal(),
  withDispatch(),
  onlyUpdateForKeys(['items', 'stepId', 'intrf'])
)(ConfigItemsContainer);
