// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';

import { Tr, Td } from '../../components/new_table';
import Text from '../../components/text';
import Checkbox from '../../components/checkbox';
import DetailButton from '../../components/detail_button';
import ServiceControls from './controls';
import withDispatch from '../../hocomponents/withDispatch';
import { Icon } from '@blueprintjs/core';
import { AlertColumn } from '../../components/AlertColumn';

type Props = {
  openPane: Function,
  closePane: Function,
  isActive?: boolean,
  updateDone: Function,
  select: Function,
  _updated?: boolean,
  has_alerts?: boolean,
  handleHighlightEnd: Function,
  handleCheckboxClick: Function,
  handleDetailClick: Function,
  _selected?: boolean,
  id: number,
  type?: string,
  threads: number,
  normalizedName: string,
  name: string,
  version: string,
  desc: string,
  enabled: boolean,
  autostart: boolean,
  status: string,
  first: boolean,
  remote: ?boolean,
  optimisticDispatch: Function,
  handleRemoteClick: Function,
};

const ServiceRow: Function = ({
  _updated,
  isActive,
  has_alerts: hasAlerts,
  handleHighlightEnd,
  handleCheckboxClick,
  handleDetailClick,
  _selected,
  type,
  threads,
  id,
  normalizedName,
  name,
  desc,
  enabled,
  autostart,
  status,
  first,
  remote,
}: Props): React.Element<any> => (
  <Tr
    first={first}
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
    className={classnames({
      'row-alert': hasAlerts,
      'row-selected': _selected,
      'row-active': isActive,
    })}
    onClick={handleCheckboxClick}
  >
    <Td className="tiny checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    <Td className="narrow">
      <DetailButton onClick={handleDetailClick} active={isActive} />
    </Td>
    <Td className="narrow">
      <Icon
        iconName={type === 'system' ? 'cog' : 'user'}
        title={type === 'system' ? 'System' : 'User'}
      />
    </Td>
    <Td className="big">
      <ServiceControls
        id={id}
        enabled={enabled}
        autostart={autostart}
        status={status}
        remote={remote}
        type={type}
      />
    </Td>
    <Td className="narrow">{threads}</Td>
    <AlertColumn onClick={handleDetailClick} hasAlerts={hasAlerts} />
    <Td className="narrow">{id}</Td>
    <Td className="name" title={name}>
      {normalizedName}
    </Td>
    <Td className="text">
      <Text text={desc} />
    </Td>
  </Tr>
);

export default compose(
  withDispatch(),
  withHandlers({
    handleCheckboxClick: ({ select, id }: Props): Function => (): void => {
      select(id);
    },
    handleHighlightEnd: ({ updateDone, id }: Props): Function => (): void => {
      updateDone(id);
    },
    handleDetailClick: ({
      openPane,
      id,
      isActive,
      closePane,
    }: Props): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(id);
      }
    },
  }),
  pure([
    'isActive',
    'enabled',
    'status',
    'autostart',
    'alerts',
    'has_alerts',
    '_selected',
    '_updated',
    'isTablet',
    'remote',
  ])
)(ServiceRow);
