// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Breadcrumbs } from '../../components/breadcrumbs';
import Crumb from '../../components/breadcrumbs/crumb';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import settings from '../../settings';

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const OAuth2Header: Function = (): React.Element<any> => (
  <Headbar>
    <Breadcrumbs>
      <Crumb>Plugins</Crumb>
      <Crumb active>OAuth2</Crumb>
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

              const url = `${settings.OAUTH_URL}/public/token?response_type=code&client_id=uitest&username=admin&password=admin&redirect_uri=${redirectUri}`;

              window.location.href = url;
            }}
          />
        </ButtonGroup>
      )}
    </Pull>
  </Headbar>
);

export default compose(onlyUpdateForKeys([]))(OAuth2Header);
