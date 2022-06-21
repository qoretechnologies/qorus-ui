import { ReqoreContent, ReqoreLayoutContent, ReqoreUIProvider } from '@qoretechnologies/reqore';
import { IntlProvider } from 'react-intl';
import messages from '../js/intl/messages';
import './custom.css';

export const Wrapper = ({ children }) => (
  <IntlProvider messages={messages('en-US')} locale="en-US">
    <ReqoreUIProvider>
      <ReqoreLayoutContent withSidebar>
        <ReqoreContent>{children}</ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  </IntlProvider>
);
