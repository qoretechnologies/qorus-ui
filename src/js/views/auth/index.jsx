// @flow
import { FormGroup, Icon, InputGroup } from '@blueprintjs/core';
import { ReqoreUIProvider } from '@qoretechnologies/reqore';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import elementsLogo from '../../../img/elements.png';
import logo from '../../../img/qorus_engine_logo.png';
import Alert from '../../components/alert';
import Box from '../../components/box';
import {
  Control as Button,
  Controls as ButtonGroup,
} from '../../components/controls';
import Flex from '../../components/Flex';
import SystemInfo from '../../containers/system_info';
import titleManager from '../../hocomponents/TitleManager';
import settings from '../../settings';
import { post } from '../../store/api/utils';

type Props = {
  location: any,
  info: Object,
  handleFormSubmit: Function,
  loginStatus: Object,
  handleUsernameChange: Function,
  handlePasswordChange: Function,
  changePassword: Function,
  changeUsername: Function,
  username: string,
  password: string,
};

const Login: Function = ({
  info,
  handleFormSubmit,
  loginStatus: { loading, error, hasNext, hasLogout },
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}: Props): React.Element<any> => (
  <ReqoreUIProvider theme={{ main: '#ffffff' }}>
    <div
      className="root"
      style={{
        background: `url(${elementsLogo})`,
        backgroundPosition: 'bottom right',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Flex style={{ justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} style={{ width: 400 }} />
        <form onSubmit={handleFormSubmit}>
          <Box top noPadding width={400}>
            <Flex
              flex="0 1 auto"
              flexFlow="row"
              style={{ justifyContent: 'space-between' }}
              className="authorize-header"
            >
              <span>
                <Icon icon="log-in" />
                Log in to {info['instance-key']}
              </span>
              <span style={{ color: '#aaa' }}>{info['omq-version']}</span>
            </Flex>
            <Flex flex="10 1 auto" className="authorize-content">
              {hasLogout && (
                <React.Fragment>
                  <Alert bsStyle="success">
                    You have been successfuly logged out
                  </Alert>
                  <br />
                </React.Fragment>
              )}
              {hasNext && (
                <React.Fragment>
                  <Alert bsStyle="info">Log in to access {hasNext}</Alert>
                  <br />
                </React.Fragment>
              )}
              {error && (
                <React.Fragment>
                  <Alert bsStyle="danger">{error}</Alert>
                  <br />
                </React.Fragment>
              )}
              <FormGroup label="Username" labelFor="username" required={true}>
                <InputGroup
                  id="username"
                  placeholder="Username"
                  required={true}
                  disabled={loading}
                  onChange={handleUsernameChange}
                  value={username}
                />
              </FormGroup>
              <FormGroup label="Password" labelFor="password" required={true}>
                <InputGroup
                  required={true}
                  id="password"
                  placeholder="Password"
                  type="password"
                  disabled={loading}
                  onChange={handlePasswordChange}
                  value={password}
                />
              </FormGroup>
            </Flex>
            <Flex flex="0 1 auto" className="authorize-footer">
              <ButtonGroup className="bp3-fill" style={{ lineHeight: '30px' }}>
                <Button
                  id="submit"
                  text="Log in"
                  icon="small-tick"
                  btnStyle={!loading && 'success'}
                  loading={loading}
                  type="submit"
                  big
                />
              </ButtonGroup>
            </Flex>
          </Box>
        </form>
      </Flex>
      <SystemInfo info={info} />
    </div>
  </ReqoreUIProvider>
);

export default compose(
  connect((state) => ({ info: state.api.info.data })),
  withState('username', 'changeUsername', null),
  withState('password', 'changePassword', null),
  withState('loginStatus', 'changeLoginStatus', ({ location }) => ({
    loading: false,
    text: null,
    error: null,
    hasNext: location.query.next,
    hasLogout: location.query.logout,
  })),
  withHandlers({
    handleUsernameChange:
      ({ changeUsername }: Props): Function =>
      ({ target }): void => {
        changeUsername(() => target.value);
      },
    handlePasswordChange:
      ({ changePassword }: Props): Function =>
      ({ target }): void => {
        changePassword(() => target.value);
      },
    handleFormSubmit:
      ({ username, password, changeLoginStatus, location }): Function =>
      async (e: any): void => {
        e.preventDefault();

        changeLoginStatus((loginStatus) => ({
          ...loginStatus,
          loading: true,
          error: null,
        }));

        const loginData: Object = await post(
          `${settings.REST_BASE_URL}/public/login`,
          {
            body: JSON.stringify({ user: username, pass: password }),
          }
        );

        if (loginData.err) {
          changeLoginStatus((loginStatus) => ({
            ...loginStatus,
            loading: false,
            error: loginData.desc,
          }));
        } else {
          const nextUrl = location.query.next || '/';
          window.localStorage.setItem('token', loginData.token);
          window.location.href = decodeURIComponent(nextUrl);
        }
      },
  }),
  titleManager('Login'),
  pure(['location', 'info', 'loginStatus', 'username', 'password'])
)(Login);
