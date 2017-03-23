// @flow
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import { Tr, Td } from '../../../components/new_table';
import { Controls, Control as Button } from '../../../components/controls';
import Autocomponent from '../../../components/autocomponent';
import Text from '../../../components/text';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import PingModal from './modals/ping';

type Props = {
  name: string,
  isActive?: boolean,
  hasAlerts?: boolean,
  _updated?: boolean,
  handleHighlightEnd: Function,
  handleDetailClick: Function,
  handlePingClick: Function,
  updateDone: Function,
  type: string,
  remoteType: string,
  openModal: Function,
  closeModal: Function,
  openPane: Function,
  up?: boolean,
  name: string,
  safe_url?: string,
  url?: string,
  desc?: string,
  options: Object,
};

const ConnectionRow: Function = ({
  isActive,
  hasAlerts,
  _updated,
  handleHighlightEnd,
  handleDetailClick,
  handlePingClick,
  up,
  name,
  safe_url: safeUrl,
  url,
  desc,
  remoteType,
  options,
}: Props): React.Element<any> => (
  <Tr
    className={classnames({
      info: isActive,
      'row-alert': hasAlerts,
    })}
    highlight={_updated}
    handleHighlightEnd={handleHighlightEnd}
  >
    <Td className="narrow">
      <Autocomponent>{up}</Autocomponent>
    </Td>
    <Td className="narrow">
      <Button
        label="Detail"
        btnStyle="success"
        onClick={handleDetailClick}
      />
    </Td>
    <Td className="tiny">
      {hasAlerts && (
        <Controls>
          <Button
            title="Show alerts"
            icon="warning"
            btnStyle="danger"
            onClick={handleDetailClick}
          />
        </Controls>
      )}
    </Td>
    <Td className="name">
      <Text text={name} />
    </Td>
    {remoteType === 'datasources' ? (
      <Td className="text">
        <Text text={JSON.stringify(options)} />
      </Td>
    ) : (
      <Td className="text">
        <Text text={safeUrl || url} />
      </Td>
    )}
    <Td className="text">
      <Text text={desc} />
    </Td>
    <Td className="normal">
      <Button
        label="Ping"
        icon="exchange"
        btnStyle="success"
        onClick={handlePingClick}
      />
    </Td>
  </Tr>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.remotes.updateDone,
    }
  ),
  withModal(),
  withHandlers({
    handleHighlightEnd: ({ name, updateDone }: Props): Function => (): void => {
      updateDone(name);
    },
    handleDetailClick: ({ name, openPane }: Props): Function => (): void => {
      openPane(name);
    },
    handlePingClick: ({ name, remoteType, openModal, closeModal }: Props): Function => (): void => {
      openModal(
        <PingModal
          name={name}
          onClose={closeModal}
          type={remoteType}
        />
      );
    },
  }),
  pure([
    'hasAlerts',
    'isActive',
    '_updated',
    'up',
  ])
)(ConnectionRow);
