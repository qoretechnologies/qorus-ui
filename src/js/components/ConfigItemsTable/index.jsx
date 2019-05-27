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
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import modal from '../../hocomponents/modal';
import Table from './table';

type ConfigItemsContainerProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
  openModal: Function,
  stepId?: number,
};

const intrfToLevelType = {
  workflows: 'step',
  services: 'service',
  jobs: 'job',
};

const ConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
  showDescription,
  openModal,
  closeModal,
  intrfId,
  stepId,
}: ConfigItemsContainerProps): React.Element<any> => {
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
    <NoDataIf condition={size(items) === 0} big>
      {() => (
        <React.Fragment>
          {map(items, (configItems: Array<Object>, belongsTo: string) => (
            <ExpandableItem title={belongsTo} key={belongsTo} show>
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
  onlyUpdateForKeys(['items', 'stepId', 'intrf'])
)(ConfigItemsContainer);
