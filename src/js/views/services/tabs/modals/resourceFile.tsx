// @flow
import Editor from '@monaco-editor/react';
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
      setData(contents);
    }

    setIsLoading(false);
  });

  const renderContent = () => {
    if (data.mimetype.startsWith('image/')) {
      return <img src={`data:${data.mimetype};base64,${data.data}`} />;
    }

    if (data.type === 'N' || data.type === 'T') {
      // Get everything after the /
      const language = data.mimetype.split('/')[1].replace('x-', '');

      return (
        <Editor
          height="100%"
          language={language}
          value={data.data}
          options={{
            readOnly: true,
            // do not scroll after last line
            scrollBeyondLastLine: false,
          }}
        />
      );
    }

    return <pre>{data.data}</pre>;
  };

  return (
    <ReqoreModal {...rest} label={`Contents for: ${name}`} width="80vw" height="80vh">
      {isLoading && <ReqoreSpinner centered>Loading file contents...</ReqoreSpinner>}
      {data ? renderContent() : null}
      {error && <ReqoreMessage intent="danger">{error}</ReqoreMessage>}
    </ReqoreModal>
  );
};

export default ResourceFileModal;
