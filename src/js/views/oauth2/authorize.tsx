// @flow
import { Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import elementsLogo from '../../../img/elements.png';
import logo from '../../../img/qorus_engine_logo.png';
import Flex from '../../components/Flex';
import Box from '../../components/box';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import queryControl from '../../hocomponents/queryControl';
import settings from '../../settings';
import { fetchWithNotifications, get } from '../../store/api/utils';

type AuthenticateViewProps = {
  allQueryObj: any;
  hasDenied: boolean;
  handleApproveClick: Function;
  handleUndoClick: Function;
  handleDenyClick: Function;
  info: any;
};

const AuthenticateView: Function = ({
  allQueryObj,
  hasDenied,
  info,
  handleApproveClick,
  handleUndoClick,
  handleDenyClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
AuthenticateViewProps) => (
  <div
    className="root"
    style={{
      background: `url(${elementsLogo})`,
      backgroundPosition: 'bottom right',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <Flex style={{ justifyContent: 'center', alignItems: 'center' }} className="oauth-flow">
      <img src={logo} style={{ width: 400 }} />
      <Box top noPadding style={{ width: 450, minHeight: 300 }}>
        <Flex
          flex="0 1 auto"
          flexFlow="row"
          style={{ justifyContent: 'space-between' }}
          className={`authorize-header ${hasDenied && 'denied'}`}
        >
          <span>
            {hasDenied && [<Icon icon="disable" />, <span>Authorization denied</span>]}
            {!hasDenied && [<Icon icon="confirm" />, <span>Authorization required</span>]}
          </span>
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'. */}
          <span style={{ color: '#aaa' }}>{info.data['instance-key']}</span>
        </Flex>
        <Flex
          flex="10 1 auto"
          className="authorize-content"
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          {hasDenied && (
            <div>
              You have <strong>denied</strong> the authorization request for
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message */}
              <div className="client-id">{allQueryObj.client_id} </div>
              If this was a mistake, select "Undo".
            </div>
          )}
          {!hasDenied && (
            <div>
              The following client is requesting authorization
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message */}
              <div className="client-id">{allQueryObj.client_id} </div>
              By authorizing this request, the client will have access to your resources and
              information. Select "Deny" if you do not wish to allow this.
            </div>
          )}
        </Flex>
        <Flex flex="0 1 auto" className="authorize-footer">
          {hasDenied && (
            <ButtonGroup className="bp3-fill">
              <Button btnStyle="primary" big icon="undo" text="Undo" onClick={handleUndoClick} />
            </ButtonGroup>
          )}
          {!hasDenied && (
            <ButtonGroup className="bp3-fill">
              <Button btnStyle="danger" big icon="disable" text="Deny" onClick={handleDenyClick} />
              <Button
                btnStyle="success"
                big
                icon="tick"
                text="Grant"
                onClick={handleApproveClick}
              />
            </ButtonGroup>
          )}
        </Flex>
      </Box>
    </Flex>
  </div>
);

export default compose(
  withState('hasDenied', 'deny', false),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  connect((state) => ({
    info: state.api.info,
  })),
  withHandlers({
    handleDenyClick:
      ({ deny, allQueryObj }): Function =>
      (): void => {
        window.location.href = `${allQueryObj.redirect_uri}?error=access_denied&error_description=The user clicked deny`;
      },
    handleUndoClick:
      ({ deny }): Function =>
      (): void => {
        deny(() => false);
      },
    handleApproveClick:
      ({
        dispatchAction,
        allQueryObj,
        dispatch,
        // @ts-ignore ts-migrate(1055) FIXME: Type 'void' is not a valid async function return t... Remove this comment to see the full error message
      }): Function =>
      async (): Promise<void> => {
        const res = await fetchWithNotifications(
          async () => {
            let query: string = `${settings.OAUTH_URL}/code?type=code&client_id=${allQueryObj.client_id}`;
            if (allQueryObj.code_challenge) {
              query += `&code_challenge=${allQueryObj.code_challenge}`;
              if (allQueryObj.code_challenge_method) {
                query += `&code_challenge_method=${allQueryObj.code_challenge_method}`;
              }
            }
            if (allQueryObj.state) {
              query += `&state=${allQueryObj.state}`
            }
            return get(query);
          },
          `Authorizing client ${allQueryObj.client_id}...`,
          `Client ${allQueryObj.client_id} successfully authorized.`,
          dispatch
        );

        if (!res.err) {
          let query: string = `${allQueryObj.redirect_uri}?code=${res.code}&client_id=${allQueryObj.client_id}`;
          if (allQueryObj.code_challenge) {
            query += `&code_challenge=${allQueryObj.code_challenge}`;
            if (allQueryObj.code_challenge_method) {
              query += `&code_challenge_method=${allQueryObj.code_challenge_method}`;
            }
          }
          if (allQueryObj.state) {
            query += `&state=${allQueryObj.state}`
          }
          window.location.href = query;
        }
      },
  }),
  onlyUpdateForKeys(['allQuery', 'hasDenied', 'hasApproved', 'info'])
)(AuthenticateView);
