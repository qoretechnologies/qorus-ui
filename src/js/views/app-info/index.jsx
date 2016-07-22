/* @flow */
import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import showOrLoad from '../../helpers/show-or-load';
import actions from '../../store/api/actions';

/**
 * Preload app info into state before rendering application
 */
const AppInfo = ({ children }: { children: any }) => (
  <div className="app__wrap">{children}</div>
);

export default compose(
  connect(
    state => ({
      noauth: state.api.info.data.noauth,
    }),
    {
      load: actions.info.loadPublicInfo,
    }
  ),
  showOrLoad('noauth', PropTypes.bool)
)(AppInfo);
