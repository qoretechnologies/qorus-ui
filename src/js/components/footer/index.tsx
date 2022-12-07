/* @flow */
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { HELP_DATA } from '../../constants/help';
import withModal from '../../hocomponents/modal';
import Box from '../box';
import Modal from '../modal';
import PaneItem from '../pane_item';

type Props = {
  info: any;
  path: string;
  openModal: Function;
  closeModal: Function;
  onClose: Function;
  helpData: any;
};

const HelpModal: Function = ({
  onClose,
  helpData,
  path,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Modal>
    <Modal.Header titleId="help" onClose={onClose}>
      Help for "{path.replace('/', '')}" page
    </Modal.Header>
    <Modal.Body>
      <Box top>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'overview' does not exist on type 'Object... Remove this comment to see the full error message */}
        {helpData.overview && <p className="lead">{helpData.overview}</p>}
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'. */}
        {Object.keys(helpData.data).map(
          // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
          (header: string) => (
            <PaneItem title={header} key={header}>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'. */}
              {helpData.data[header]}
            </PaneItem>
          )
        )}
      </Box>
    </Modal.Body>
  </Modal>
);

// @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
const Footer: Function = ({ info, path, openModal, closeModal, intl }: Props) => {
  const helpItem = Object.keys(HELP_DATA).find((res: string): boolean => path.startsWith(res));

  const handleHelpClick = () => {
    if (helpItem) {
      openModal(<HelpModal onClose={closeModal} helpData={HELP_DATA[helpItem]} path={path} />);
    }
  };

  return (
    <footer>
      <p className="text-right text-muted">
        {'Qorus Integration Engine '}
        {info['omq-schema'] && (
          <small>
            {'(' + intl.formatMessage({ id: 'global.schema' }) + `: ${info['omq-schema']})`}
          </small>
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
              <FormattedMessage id="global.help" />
            </a>
          </span>
        )}
        {' | '}
        <a href={'https://github.com/qoretechnologies/qorus-ui/issues/new/choose'} target="_blank">
          <FormattedMessage id="global.report-bug" />
        </a>
      </p>
    </footer>
  );
};

export default compose(withModal(), pure(['info', 'location']), injectIntl)(Footer);
