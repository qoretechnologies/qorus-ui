import { API_URL } from '../../../server_config';

const CodeView = () => {
  const URL = API_URL;

  return <iframe src={`${URL}/registerDevTools?token=${localStorage.getItem('token')}`} />;
};

export default CodeView;
