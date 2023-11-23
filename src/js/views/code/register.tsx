import { ReqoreSpinner } from '@qoretechnologies/reqore';
import { useMount } from 'react-use';
import queryControl from '../../hocomponents/queryControl';

const RegisterCodeView = ({ tokenQuery }) => {
  useMount(() => {
    const token = localStorage.getItem('token') || tokenQuery;

    document.cookie = `Qorus-Auth-Context=${token}; path=/`;
    window.location.href = `https://hq.qoretechnologies.com:8092/code/?token=${token}`;
  });

  return <ReqoreSpinner centered>Loading...</ReqoreSpinner>;
};

export default queryControl('token')(RegisterCodeView);
