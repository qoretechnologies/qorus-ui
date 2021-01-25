import { Button, Spinner } from '@blueprintjs/core';
import jsyaml from 'js-yaml';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import { injectIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import useStayScrolled from 'react-stay-scrolled';
import { useUnmount } from 'react-use';
import styled, { css } from 'styled-components';
import Box from '../components/box';
import Modal from '../components/modal';
import { COLORS } from '../constants/ui';
import { del, fetchText } from '../store/api/utils';
import { connectCall } from '../store/websockets/actions';

const StyledWrapper = styled.div`
  display: flex;
`;

const StyledSection = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
`;

const StyledDropzoneWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 1px dashed #d7d7d7;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  p {
    text-align: center;
  }
`;

const StyledStep = styled.div`
  width: ${({ fluid }) => (fluid ? '100%' : '50%')};
  transition: all 0.2s linear;
  min-height: 200px;
  max-height: 500px;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
  &:not(:last-child) {
    margin-right: 15px;
  }
  display: flex;
  flex-flow: column;
  overflow: hidden;
`;

const StyledStepTitle = styled.h5`
  padding: 15px;
  margin: 0;
  overflow: hidden;
  position: relative;

  ${({ color }) => css`
    border-bottom: 1px solid ${color};

    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 152px;
      height: 152px;
      background-color: ${color};
      top: 13px;
      right: -60px;
      transform: rotateZ(45deg);
    }
  `}
`;

const StyledStepContent = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;

  &.release-installation-progress {
    background-color: #222;
    font-family: monospace;
    color: #eee;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 1;
    overflow: auto;

    p {
      width: 100%;
      padding: 10px;
      display: block;
      margin-bottom: 0;
      &:nth-child(even) {
        background-color: #f5f5f5;
      }
    }

    div.release-last {
      width: 100%;

      p {
        background-color: #7fba27ab;
      }
    }
  }
`;

const ReleaseModal = ({ onClose, intl }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [connectionOpened, setConnectionOpened] = useState(false);
  const [wsMessage, setWsMessage] = useState('');
  const [finished, setFinished] = useState(false);
  const installationRef = useRef();
  const { stayScrolled } = useStayScrolled(installationRef);

  useEffect(() => {
    if (fileId) {
      const { ws } = connectCall(
        'remote-command',
        () => true,
        () => setConnectionOpened(true),
        (url, data) =>
          setWsMessage((cur) => {
            const msgData = jsyaml.safeLoad(data);

            if (msgData.data.startsWith('installation complete!')) {
              setFinished(true);
              deleteFolder();
            }

            return cur + msgData.data.replace(/\n/g, '  \n');
          }),
        null,
        null,
        null,
        false
      );

      setConnection(ws);
    }
  }, [fileId]);

  useEffect(() => {
    if (connectionOpened) {
      connection.send(
        jsyaml.safeDump({
          cmd: 'oload',
          dir: fileId,
          files: [file?.[0].name],
          opts: '-lvR',
        })
      );
    }
  }, [connectionOpened]);

  useLayoutEffect(() => {
    stayScrolled();
  }, [wsMessage]);

  useUnmount(() => {
    if (connection && connectionOpened) {
      connection.close(1000);
    }
  });

  const deleteFolder = () => {
    if (fileId) {
      del('/raw/remote-file', { headers: { Dir: fileId } });
    }
  };

  const reset = () => {
    if (connection && connectionOpened) {
      connection.close(1000);
    }

    setFile(null);
    setLoading(false);
    setResponse(null);
    setFileId(null);
    setConnection(null);
    setConnectionOpened(false);
    setWsMessage('');
    setFinished(false);
    deleteFolder();
  };

  return (
    <Modal width="70vw">
      <Modal.Header onClose={onClose}>
        {intl.formatMessage({ id: 'global.create-release' })}
      </Modal.Header>
      <Modal.Body>
        <Box top fill>
          <StyledWrapper>
            <StyledStep
              style={
                connectionOpened
                  ? { maxHeight: '0px', minHeight: '0px', border: 0 }
                  : undefined
              }
            >
              <StyledStepTitle color={file ? COLORS.green : '#eee'}>
                {intl.formatMessage({ id: 'global.release-select-file' })}
              </StyledStepTitle>
              <StyledStepContent>
                <Dropzone
                  onDrop={(f) => {
                    reset();
                    setFile(f);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <StyledSection>
                      <StyledDropzoneWrapper {...getRootProps()}>
                        <input {...getInputProps()} />
                        {file?.[0] ? (
                          <p>
                            <strong>{file[0].name}</strong>{' '}
                            {intl.formatMessage({ id: 'global.file-selected' })}
                          </p>
                        ) : (
                          <p>
                            {intl.formatMessage({
                              id: 'global.release-click-drop-upload',
                            })}
                          </p>
                        )}
                      </StyledDropzoneWrapper>
                    </StyledSection>
                  )}
                </Dropzone>
              </StyledStepContent>
            </StyledStep>
            <StyledStep
              style={{
                opacity: file ? 1 : 0.5,
                maxHeight: connectionOpened ? '0px' : undefined,
                minHeight: connectionOpened ? '0px' : undefined,
                border: connectionOpened ? '0' : undefined,
              }}
            >
              <StyledStepTitle color={fileId ? COLORS.green : '#eee'}>
                {intl.formatMessage({ id: 'global.release-upload-file' })}
              </StyledStepTitle>
              <StyledStepContent>
                {response ? (
                  <>
                    <p>{response}</p>
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <>
                        <Spinner size={22} />{' '}
                        {intl.formatMessage({ id: 'global.uploading-file' })}
                      </>
                    ) : (
                      <Button
                        intent={!file ? 'warning' : 'none'}
                        icon={!file ? undefined : 'small-tick'}
                        disabled={!file}
                        onClick={async () => {
                          setLoading(true);

                          const reader = new FileReader();
                          reader.onload = async () => {
                            // Do whatever you want with the file contents
                            const binaryStr = reader.result;
                            const response = await fetchText(
                              'POST',
                              `/raw/remote-file`,
                              {
                                body: binaryStr,
                                headers: {
                                  'Content-Type': 'application/octet-stream',
                                  Filepath: file?.[0].name,
                                },
                              },
                              false,
                              false
                            );

                            setLoading(false);
                            setResponse(
                              intl.formatMessage({
                                id: 'global.file-successfuly-uploaded',
                              })
                            );
                            setFileId(response);
                          };
                          reader.readAsArrayBuffer(file?.[0]);
                        }}
                      >
                        {!file ? (
                          intl.formatMessage({ id: 'global.no-file-selected' })
                        ) : (
                          <>
                            {intl.formatMessage({
                              id: 'global.release-submit',
                            })}{' '}
                            <strong>{file?.[0].name}</strong>
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </StyledStepContent>
            </StyledStep>
          </StyledWrapper>
          <StyledStep
            fluid
            style={{
              flex: 1,
              marginTop: connectionOpened ? 0 : '10px',
              opacity: fileId ? 1 : 0.5,
              minHeight: connectionOpened ? '400px' : undefined,
            }}
          >
            <StyledStepTitle color={finished ? COLORS.green : '#eee'}>
              {intl.formatMessage({
                id: 'global.release-installation-progress',
              })}
              {connectionOpened || finished ? (
                <Button
                  onClick={() => reset()}
                  intent={finished ? 'success' : 'warning'}
                  style={{ marginLeft: '30px' }}
                >
                  {finished
                    ? intl.formatMessage({
                        id: 'global.release-again',
                      })
                    : intl.formatMessage({
                        id: 'global.release-cancel',
                      })}
                </Button>
              ) : null}
            </StyledStepTitle>
            <StyledStepContent
              className="release-installation-progress"
              ref={installationRef}
            >
              {connectionOpened && wsMessage === '' ? (
                <StyledStepContent>
                  <Spinner size={22} />{' '}
                  {intl.formatMessage({
                    id: 'global.release-waiting-for-data',
                  })}
                </StyledStepContent>
              ) : null}
              {wsMessage !== '' && <ReactMarkdown>{wsMessage}</ReactMarkdown>}
            </StyledStepContent>
          </StyledStep>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default injectIntl(ReleaseModal);
