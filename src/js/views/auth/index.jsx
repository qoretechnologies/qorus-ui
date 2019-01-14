// @flow
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import getContext from 'recompose/getContext';
import withHandlers from 'recompose/withHandlers';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import { CenterWrapper } from '../../components/layout';
import actions from '../../store/api/actions';
import LoginForm from '../../containers/auth/form';
import SystemInfo from '../../containers/system_info';
import { auth } from '../../helpers/user';
import logo from '../../../img/qore_logo.png';
import titleManager from '../../hocomponents/TitleManager';

type Props = {
  location: any,
  sendAuthCredentials: Function,
  info: Object,
  router: Object,
  handleSubmit: Function,
};

const Login: Function = ({ info, handleSubmit }: Props): React.Element<any> => (
  <div className="full-background">
    <CenterWrapper>
      <div className="login-wrapper">
        <h1 className="login-header">
          <img src={logo} />
          Qorus Integration Engine <span className="small reg">&reg;</span>
          <p className="login-instance-wrapper">
            <span> {info['instance-key']} </span>
          </p>
        </h1>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </CenterWrapper>
    <SystemInfo info={info} />
  </div>
);

export default compose(
  connect(
    state => ({ info: state.api.info.data }),
    actions.auth
  ),
  getContext({
    router: PropTypes.object,
  }),
  withHandlers({
    handleSubmit: ({
      location,
      router,
      sendAuthCredentials,
    }: Props): Function => async ({ login, password }: Object): ?Promise<*> => {
      await auth(login, password, sendAuthCredentials);

      const nextUrl = location.query.next || '/';
      router.push(decodeURIComponent(nextUrl));
    },
  }),
  titleManager('Login'),
  pure(['location', 'info'])
)(Login);
