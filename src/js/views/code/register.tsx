import {
  ReqoreColumn,
  ReqoreColumns,
  ReqoreContent,
  ReqoreLayoutContent,
  ReqoreSpinner,
  ReqoreUIProvider,
} from '@qoretechnologies/reqore';
import { useMount } from 'react-use';
import { API_URL } from '../../../server_config';
import queryControl from '../../hocomponents/queryControl';

const RegisterCodeView = ({ tokenQuery }) => {
  useMount(() => {
    const URL = API_URL;
    const token = localStorage.getItem('token') || tokenQuery;

    console.log(token);

    document.cookie = `Qorus-Auth-Context=${token}; path=/; secure; samesite=none;`;

    // Log the cookies
    console.log(document.cookie);

    window.location.href = `${URL}/code/?token=${token}`;
  });

  return (
    <ReqoreUIProvider>
      <ReqoreLayoutContent>
        <ReqoreContent style={{ height: '100%' }}>
          <ReqoreColumns style={{ gridAutoRows: '1fr', height: '100%' }}>
            <ReqoreColumn justifyContent="center" alignItems="center" flexFlow="column">
              <ReqoreSpinner centered>Loading...</ReqoreSpinner>
            </ReqoreColumn>
          </ReqoreColumns>
        </ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  );
};

export default queryControl('token')(RegisterCodeView);
