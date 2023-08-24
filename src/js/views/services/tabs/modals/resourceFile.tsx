// @flow
import { ReqoreMessage, ReqoreModal, ReqoreSpinner } from '@qoretechnologies/reqore';
import { useState } from 'react';
import { useMount } from 'react-use';
import settings from '../../../../settings';
import { get } from '../../../../store/api/utils';

type ResourceFileModalProps = {
  id: string;
  name: string;
};

const ResourceFileModal: Function = ({
  id,
  name,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ResourceFileModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  useMount(async () => {
    const contents = await get(`${settings.REST_BASE_URL}/services/${id}/resource_files/${name}`);

    if (contents.err) {
      setData(undefined);
      setError(contents.desc);
    } else {
      setError(undefined);
      setData(contents.data);
    }

    setIsLoading(false);
  });

  return (
    <ReqoreModal {...rest} label={`Contents for: ${name}`} width="80vw">
      {isLoading && <ReqoreSpinner centered>Loading file contents...</ReqoreSpinner>}
      {data && <pre>{data}</pre>}
      {error && <ReqoreMessage intent="danger">{error}</ReqoreMessage>}
    </ReqoreModal>
  );
};

export default ResourceFileModal;
