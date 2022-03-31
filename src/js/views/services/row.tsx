// @flow
import { Icon } from '@blueprintjs/core';
import classnames from 'classnames';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn } from '../../components/ActionColumn';
import { DescriptionColumn } from '../../components/DescriptionColumn';
import { IdColumn } from '../../components/IdColumn';
import NameColumn from '../../components/NameColumn';
import { Td, Tr } from '../../components/new_table';
import { SelectColumn } from '../../components/SelectColumn';
import withDispatch from '../../hocomponents/withDispatch';
import ServiceControls from './controls';

type Props = {
  openPane: Function;
  closePane: Function;
  isActive?: boolean;
  updateDone: Function;
  select: Function;
  _updated?: boolean;
  has_alerts?: boolean;
  handleHighlightEnd: Function;
  handleCheckboxClick: Function;
  handleDetailClick: Function;
  _selected?: boolean;
  id: number;
  type?: string;
  threads: number;
  normalizedName: string;
  name: string;
  version: string;
  desc: string;
  enabled: boolean;
  autostart: boolean;
  status: string;
  first: boolean;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  remote: boolean;
  optimisticDispatch: Function;
  handleRemoteClick: Function;
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
  desc,
  enabled,
  autostart,
  status,
  first,
  remote,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr
    first={first}
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
    className={classnames({
      'row-selected': _selected,
      'row-alert': hasAlerts,
      'row-active': isActive,
    })}
    onClick={handleCheckboxClick}
  >
    <SelectColumn onClick={handleCheckboxClick} checked={_selected} />
    <IdColumn>{id}</IdColumn>
    <NameColumn
      name={normalizedName}
      hasAlerts={hasAlerts}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      link={`/service/${id}`}
      type="service"
    />
    <ActionColumn className="big">
      <ServiceControls
        id={id}
        enabled={enabled}
        autostart={autostart}
        status={status}
        remote={remote}
        type={type}
      />
    </ActionColumn>
    <Td className="medium">
      <Icon
        icon={type === 'system' ? 'cog' : 'user'}
        title={type === 'system' ? 'System' : 'User'}
      />
    </Td>
    <Td className="medium">{threads}</Td>
    <DescriptionColumn>{desc}</DescriptionColumn>
  </Tr>
);

export default compose(
  withDispatch(),
  withHandlers({
    handleCheckboxClick:
      ({ select, id }: Props): Function =>
      (): void => {
        select(id);
      },
    handleHighlightEnd:
      ({ updateDone, id }: Props): Function =>
      (): void => {
        updateDone(id);
      },
    handleDetailClick:
      ({ openPane, id, isActive, closePane }: Props): Function =>
      (): void => {
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
