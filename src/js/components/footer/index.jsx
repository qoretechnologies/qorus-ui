/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import withModal from '../../hocomponents/modal';
import { HELP_DATA } from '../../constants/help';
import Modal from '../modal';
import PaneItem from '../pane_item';
import Box from '../box';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  info: Object,
  path: string,
  openModal: Function,
  closeModal: Function,
  onClose: Function,
  helpData: Object,
};

const HelpModal: Function = ({
  onClose,
  helpData,
  path,
}: Props): React.Element<any> => (
  <Modal>
    <Modal.Header titleId="help" onClose={onClose}>
      Help for "{path.replace('/', '')}" page
    </Modal.Header>
    <Modal.Body>
      <Box top>
        {helpData.overview && <p className="lead">{helpData.overview}</p>}
        {Object.keys(helpData.data).map(
          (header: string): React.Element<any> => (
            <PaneItem title={header} key={header}>
              {helpData.data[header]}
            </PaneItem>
          )
        )}
      </Box>
    </Modal.Body>
  </Modal>
);

const Footer: Function = ({ info, path, openModal, closeModal, intl }: Props) => {
  const helpItem = Object.keys(HELP_DATA).find(
    (res: string): boolean => path.startsWith(res)
  );

  const handleHelpClick = () => {
    if (helpItem) {
      openModal(
        <HelpModal
          onClose={closeModal}
          helpData={HELP_DATA[helpItem]}
          path={path}
        />
      );
    }
  };

  return (
    <footer>
      <p className="text-right text-muted">
        {'Qorus Integration Engine '}
        {info['omq-schema'] && (
          <small>{'(' + intl.formatMessage({ id: 'global.schema' }) + `: ${info['omq-schema']})`}</small>
        )}
        {info['omq-schema'] && ' '}
        {info['omq-version'] && (
          <small>
            {'(' + intl.formatMessage({ id: 'global.version' }) + ': '}
            {info['omq-version']}
            {info['omq-build'] && `.${info['omq-build']}`}
            {')'}
          </small>
        )}
        {info['omq-version'] && ' '}
        &copy; <a href="http://qoretechnologies.com">Qore Technologies</a>
        {helpItem && (
          <span>
            {' | '}
            <a onClick={handleHelpClick} href="#">
              <FormattedMessage id='global.help' />
            </a>
          </span>
        )}
        {' | '}
        <a
          href={
            'http://bugs.qoretechnologies.com/projects/webapp-interface/issues/new'
          }
        >
          <FormattedMessage id='global.report-bug' />
        </a>
      </p>
    </footer>
  );
};

export default compose(
  withModal(),
  pure(['info', 'location']),
  injectIntl
)(Footer);
