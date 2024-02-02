import {
  ReqoreColumn,
  ReqoreColumns,
  ReqoreContent,
  ReqoreH1,
  ReqoreLayoutContent,
  ReqoreP,
  ReqoreTextEffect,
  ReqoreUIProvider,
  ReqoreVerticalSpacer,
} from '@qoretechnologies/reqore';
import { withRouter } from 'react-router';

const GrantView = ({ location }) => {
  return (
    <ReqoreUIProvider>
      <ReqoreLayoutContent>
        <ReqoreContent style={{ height: '100%' }}>
          <ReqoreColumns style={{ gridAutoRows: '1fr', height: '100%' }}>
            <ReqoreColumn justifyContent="center" alignItems="center" flexFlow="column">
              <ReqoreH1 effect={{ textSize: '50px' }}>
                Authentication{' '}
                {location.query?.status === 'success' ? (
                  <ReqoreTextEffect
                    effect={{
                      gradient: {
                        colors: { 0: 'success:lighten:3', 100: 'success:lighten' },
                        animate: 'always',
                      },
                    }}
                  >
                    successful
                  </ReqoreTextEffect>
                ) : (
                  <ReqoreTextEffect
                    effect={{
                      gradient: {
                        colors: { 0: 'danger:lighten', 100: 'danger:darken' },
                        animate: 'always',
                      },
                    }}
                  >
                    error
                  </ReqoreTextEffect>
                )}
              </ReqoreH1>
              <ReqoreVerticalSpacer height={15} />
              <ReqoreP size="big">
                {location.query?.status === 'success'
                  ? 'You may now close this window and return to the application.'
                  : location.query?.message || 'An error occured during authentication.'}
              </ReqoreP>
            </ReqoreColumn>
          </ReqoreColumns>
        </ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  );
};

export default withRouter(GrantView);
