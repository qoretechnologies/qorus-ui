// @flow
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Controls as ButtonGroup } from '../../components/controls';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const OAuth2Header: Function = () => (
  <Headbar>
    <Pull right>{process.env.NODE_ENV === 'development' && <ButtonGroup></ButtonGroup>}</Pull>
  </Headbar>
);

export default compose(onlyUpdateForKeys([]))(OAuth2Header);
