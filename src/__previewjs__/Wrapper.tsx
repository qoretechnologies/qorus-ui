import {
  ReqoreColors,
  ReqoreContent,
  ReqoreLayoutContent,
  ReqoreUIProvider,
} from '@qoretechnologies/reqore';
import { IntlProvider } from 'react-intl';
import messages from '../js/intl/messages';
import './custom.css';

export const Wrapper = ({ children }) => (
  <IntlProvider messages={messages('en-US')} locale="en-US">
    <ReqoreUIProvider
      theme={{
        main: '#ffffff',
        sidebar: {
          main: '#333333',
          item: { activeBackground: ReqoreColors.BLUE, activeColor: '#ffffff' },
        },
        header: {
          main: '#333333',
        },
        intents: {
          success: '#57801a',
          danger: '#e62727',
          pending: '#ffdf34',
          warning: ReqoreColors.ORANGE,
        },
        breadcrumbs: {
          item: {
            color: '#b9b9b9',
            activeColor: ReqoreColors.BLUE,
          },
        },
      }}
    >
      <ReqoreLayoutContent withSidebar>
        <ReqoreContent style={{ padding: '15px' }}>{children}</ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  </IntlProvider>
);
