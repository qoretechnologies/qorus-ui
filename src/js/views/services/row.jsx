// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';

import { Tr, Td } from '../../components/new_table';
import Icon from '../../components/icon';
import Text from '../../components/text';
import Checkbox from '../../components/checkbox';
import ServiceControls from './controls';
import { Controls, Control as Button } from '../../components/controls';

type Props = {
  openPane: Function,
  isActive?: boolean,
  updateDone: Function,
  select: Function,
  _updated?: boolean,
  has_alerts?: boolean,
  handleHighlightEnd: Function,
  handleCheckboxClick: Function,
  handleDetailClick: Function,
  handleWarningClick: Function,
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
};

const ServiceRow: Function = ({
  _updated,
  isActive,
  has_alerts: hasAlerts,
  handleHighlightEnd,
  handleCheckboxClick,
  handleDetailClick,
  handleWarningClick,
  _selected,
  type,
  threads,
  id,
  normalizedName,
  name,
  version,
  desc,
  enabled,
  autostart,
  status,
}: Props): React.Element<any> => (
  <Tr
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
    className={classnames({
      info: isActive,
      'row-alert': hasAlerts,
    })}
  >
    <Td className="tiny checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    <Td className="narrow">
      <Button
        label="Detail"
        btnStyle="success"
        onClick={handleDetailClick}
        title="Open detail pane"
      />
    </Td>
    <Td className="narrow">
      <Icon
        icon={type === 'system' ? 'cog' : 'user'}
        tooltip={type === 'system' ? 'System' : 'User'}
      />
    </Td>
    <Td className="medium">
      <ServiceControls
        id={id}
        enabled={enabled}
        autostart={autostart}
        status={status}
      />
    </Td>
    <Td className="narrow">{ threads }</Td>
    <Td className="narrow">
      { hasAlerts && (
        <Controls>
          <Button
            icon="warning"
            btnStyle="danger"
            onClick={handleWarningClick}
            title="Show alerts"
          />
        </Controls>
      )}
    </Td>
    <Td className="narrow">{ id }</Td>
    <Td className="name">
      <p title={name}>{ normalizedName }</p>
    </Td>
    <Td className="medium text">{ version }</Td>
    <Td className="text">
      <Text text={desc} />
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleCheckboxClick: ({ select, id }: Props): Function => (): void => {
      select(id);
    },
    handleHighlightEnd: ({ updateDone, id }: Props): Function => (): void => {
      updateDone(id);
    },
    handleDetailClick: ({ openPane, id }: Props): Function => (): void => {
      openPane(id);
    },
    handleWarningClick: ({ openPane, id }: Props): Function => (): void => {
      openPane(id, 'detail');
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
  ])
)(ServiceRow);
