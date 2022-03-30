// @flow
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { Icon } from '@blueprintjs/core';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Flex from '../../components/Flex';
import Box from '../../components/box';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../components/controls';
import queryControl from '../../hocomponents/queryControl';
import { fetchWithNotifications, get } from '../../store/api/utils';
import { connect } from 'react-redux';
import settings from '../../settings';
import elementsLogo from '../../../img/elements.png';
import logo from '../../../img/qorus_engine_logo.png';

type AuthenticateViewProps = {
  allQueryObj: Object,
  hasDenied: boolean,
  handleApproveClick: Function,
  handleUndoClick: Function,
  handleDenyClick: Function,
  info: Object,
};

const AuthenticateView: Function = ({
  allQueryObj,
  hasDenied,
  info,
  handleApproveClick,
  handleUndoClick,
  handleDenyClick,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: AuthenticateViewProps): React.Element<any> => (
  <div
    className="root"
    style={{
      background: `url(${elementsLogo})`,
      backgroundPosition: 'bottom right',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <Flex
      style={{ justifyContent: 'center', alignItems: 'center' }}
      className="oauth-flow"
    >
      <img src={logo} style={{ width: 400 }} />
      <Box top noPadding style={{ width: 450, minHeight: 300 }}>
        <Flex
          flex="0 1 auto"
          flexFlow="row"
          style={{ justifyContent: 'space-between' }}
          className={`authorize-header ${hasDenied && 'denied'}`}
        >
          <span>
            {hasDenied && [
              <Icon icon="disable" />,
              <span>Authorization denied</span>,
            ]}
            {!hasDenied && [
              <Icon icon="confirm" />,
              <span>Authorization required</span>,
            ]}
          </span>
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
              <div className="client-id">{allQueryObj.client_id} </div>
              If this was a mistake, select "Undo".
            </div>
          )}
          {!hasDenied && (
            <div>
              The following client is requesting authorization
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
              <div className="client-id">{allQueryObj.client_id} </div>
              By authorizing this request, the client will have access to your
              resources and information. Select "Deny" if you do not wish to
              allow this.
            </div>
          )}
        </Flex>
        <Flex flex="0 1 auto" className="authorize-footer">
          {hasDenied && (
            <ButtonGroup className="bp3-fill">
              <Button
                btnStyle="primary"
                big
                icon="undo"
                text="Undo"
                onClick={handleUndoClick}
              />
            </ButtonGroup>
          )}
          {!hasDenied && (
            <ButtonGroup className="bp3-fill">
              <Button
                btnStyle="danger"
                big
                icon="disable"
                text="Deny"
                onClick={handleDenyClick}
              />
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
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  connect(state => ({
    info: state.api.info,
  })),
  withHandlers({
    handleDenyClick: ({ deny }): Function => (): void => {
      deny(() => true);
    },
    handleUndoClick: ({ deny }): Function => (): void => {
      deny(() => false);
    },
    handleApproveClick: ({
      dispatchAction,
      allQueryObj,
      dispatch,
    // @ts-expect-error ts-migrate(1055) FIXME: Type 'void' is not a valid async function return t... Remove this comment to see the full error message
    }): Function => async (): void => {
      const res = await fetchWithNotifications(
        async () =>
          get(
            `${settings.OAUTH_URL}/code?type=code&client_id=${
              allQueryObj.client_id
            }`
          ),
        `Authorizing client ${allQueryObj.client_id}...`,
        `Client ${allQueryObj.client_id} successfully authorized.`,
        dispatch
      );

      if (!res.err) {
        window.location.href = `${allQueryObj.redirect_uri}?code=${
          res.code
        }&client_id=${allQueryObj.client_id}`;
      }
    },
  }),
  onlyUpdateForKeys(['allQuery', 'hasDenied', 'hasApproved', 'info'])
)(AuthenticateView);
