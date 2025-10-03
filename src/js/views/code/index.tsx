import { API_URL } from '../../../server_config';
import { getToken } from '../../store/api/utils';

const CodeView = () => {
  const URL = API_URL;

  return <iframe src={`${URL}/registerDevTools?token=${getToken()}`} />;
};

export default CodeView;
