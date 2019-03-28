// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Headbar from '../../components/Headbar';
import { Breadcrumbs } from '../../components/breadcrumbs';
import Crumb from '../../components/breadcrumbs/crumb';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import settings from '../../settings';
import Pull from '../../components/Pull';

const OAuth2Header: Function = (): React.Element<any> => (
  <Headbar>
    <Breadcrumbs>
      <Crumb active link="/oauth2">
        OAuth2 Plugin
      </Crumb>
    </Breadcrumbs>
    <Pull right>
      {process.env.NODE_ENV === 'development' && (
        <ButtonGroup>
          <Button
            label="Test Qorus Access"
            btnStyle="warning"
            big
            onClick={() => {
              const redirectUri = encodeURIComponent(
                `https://${location.host}/plugins/oauth2/code`
              );

              const url = `${
                settings.OAUTH_URL
              }/public/token?response_type=code&client_id=uitest&username=admin&password=admin&redirect_uri=${redirectUri}`;

              window.location.href = url;
            }}
          />
        </ButtonGroup>
      )}
    </Pull>
  </Headbar>
);

export default compose(onlyUpdateForKeys([]))(OAuth2Header);
