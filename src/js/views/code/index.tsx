import { API_URL } from '../../../server_config';

const CodeView = () => {
  return <iframe src={`${API_URL}/registerDevTools?token=${localStorage.getItem('token')}`} />;
};

export default CodeView;
