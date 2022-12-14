// @flow
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import Box from '../../../components/box';
import Flex from '../../../components/Flex';
import queryControl from '../../../hocomponents/queryControl';
import settings from '../../../settings';
import { post } from '../../../store/api/utils';
import Header from '../header';

type CodeReceivedViewProps = {
  allQueryObj: any;
};

const CodeReceivedView: Function = ({
  token,
}: {
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  token: string;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) => (
  <Flex>
    <Header />

    <Flex style={{ justifyContent: 'center', alignItems: 'center' }} className="oauth-flow">
      <Box top noPadding style={{ width: 450, minHeight: 300 }}>
        <Flex flex="0 1 auto" flexFlow="row" className={'authorize-header'}>
          {token ? 'Token' : 'Code'} received
        </Flex>
        <Flex
          flex="10 1 auto"
          style={{ justifyContent: 'center', alignItems: 'center' }}
          className="authorize-content"
        >
          {token || 'Waiting for token...'}
        </Flex>
        <Flex flex="0 1 auto" className="authorize-footer" />
      </Box>
    </Flex>
  </Flex>
);

export default compose(
  withState('token', 'setToken', null),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  lifecycle({
    componentDidMount() {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'setToken' does not exist on type 'CodeRe... Remove this comment to see the full error message
      const { allQueryObj, setToken }: CodeReceivedViewProps = this.props;
      const redirectUri = encodeURIComponent(`https://${window.location.host}/authenticate/token`);

      setTimeout(async () => {
        let url = `${settings.OAUTH_PUBLIC_URL}/token`;
        url += `?grant_type=authorization_code&code=${
          // @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
          allQueryObj.code
          // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
        }&redirect_uri=${redirectUri}&client_id=${allQueryObj.client_id}`;

        const token = await post(url, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa('uitest:blablabla')}`,
          },
        });

        setToken(() => token.access_token);
      }, 3000);
    },
  })
)(CodeReceivedView);
