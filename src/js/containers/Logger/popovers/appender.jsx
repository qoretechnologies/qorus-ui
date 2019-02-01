// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import withState from 'recompose/withState';
import Alert from '../../../components/alert';
import withHandlers from 'recompose/withHandlers';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import { connect } from 'react-redux';
import { fetchWithNotifications, post } from '../../../store/api/utils';
import settings from '../../../settings';

type NewAppenderPopoverProps = {
  error?: string,
  name: string,
  level?: string,
  additivity: boolean,
  handleNameChange: Function,
  handleLevelChange: Function,
  handleAdditivityChange: Function,
  onCancel: Function,
  loggerLevels: Object,
  resource: string,
  id: number | string,
  changeError: Function,
  handleSubmit: Function,
  dispatch: Function,
  changeAdding: Function,
  isAdding: boolean,
  data?: Object,
};

const NewAppenderPopover: Function = ({
  error,
  name,
  handleNameChange,
  layoutPattern,
  handleLayoutPatternChange,
  filename,
  handleFilenameChange,
  encoding,
  handleEncodingChange,
  appenderType,
  handleAppenderTypeChange,
  rotationCount,
  handleRotationCountChange,
  archivePattern,
  handleArchivePatternChange,
  onCancel,
  handleSubmit,
  changeError,
  dispatch,
  isAdding,
}: NewAppenderPopoverProps): React.Element<any> => (
  <Box fill top style={{ minWidth: '350px' }}>
    {error && <Alert bsStyle="danger">{error}</Alert>}
    <FormGroup label="Name " labelFor="appender-name" requiredLabel>
      <InputGroup
        name="appender-name"
        id="appender-name"
        value={name}
        onChange={handleNameChange}
      />
    </FormGroup>

    <FormGroup label="Appender type " labelFor="appender-type" requiredLabel>
      <InputGroup
        name="appender-type"
        id="appender-type"
        value={appenderType}
        onChange={handleAppenderTypeChange}
      />
    </FormGroup>

    <FormGroup label="Layout pattern" labelFor="appender-layout">
      <InputGroup
        name="appender-layout"
        id="appender-layout"
        value={layoutPattern}
        onChange={handleLayoutPatternChange}
      />
    </FormGroup>

    <FormGroup label="Filename" labelFor="appender-filename">
      <InputGroup
        name="appender-filename"
        id="appender-filename"
        value={filename}
        onChange={handleFilenameChange}
      />
    </FormGroup>

    <FormGroup label="Encoding" labelFor="appender-encoding">
      <InputGroup
        name="appender-encoding"
        id="appender-encoding"
        value={encoding}
        onChange={handleEncodingChange}
      />
    </FormGroup>

    <FormGroup label="Rotation count" labelFor="appender-rotation">
      <InputGroup
        name="appender-rotation"
        id="appender-rotation"
        value={rotationCount}
        onChange={handleRotationCountChange}
      />
    </FormGroup>

    <FormGroup label="Archive pattern" labelFor="appender-archive">
      <InputGroup
        name="appender-archive"
        id="appender-archive"
        value={archivePattern}
        onChange={handleArchivePatternChange}
      />
    </FormGroup>

    <ButtonGroup className="pt-fill">
      <Button
        text="Cancel"
        icon="cross"
        onClick={onCancel}
        disabled={isAdding}
      />
      <Button
        disabled={isAdding}
        btnStyle="success"
        text="Submit"
        icon="small-tick"
        onClick={handleSubmit}
      />
    </ButtonGroup>
  </Box>
);

export default compose(
  connect(),
  withState('name', 'changeName', null),
  withState('layoutPattern', 'changeLayoutPattern', null),
  withState('filename', 'changeFilename', null),
  withState('encoding', 'changeEncoding', null),
  withState('appenderType', 'changeAppenderType', null),
  withState('rotationCount', 'changeRotationCount', 0),
  withState('archivePattern', 'changeArchivePattern', null),
  withState('error', 'changeError', null),
  withState('isAdding', 'changeAdding', false),
  withHandlers({
    handleNameChange: ({ changeName }): Function => (event: Object): void => {
      event.persist();

      changeName(() => event.target.value);
    },
    handleLayoutPatternChange: ({ changeLayoutPattern }): Function => (
      event: Object
    ): void => {
      event.persist();

      changeLayoutPattern(() => event.target.value);
    },
    handleFilenameChange: ({ changeFilename }): Function => (
      event: Object
    ): void => {
      event.persist();

      changeFilename(() => event.target.value);
    },
    handleEncodingChange: ({ changeEncoding }): Function => (
      event: Object
    ): void => {
      event.persist();

      changeEncoding(() => event.target.value);
    },
    handleAppenderTypeChange: ({ changeAppenderType }): Function => (
      event: Object
    ): void => {
      event.persist();

      changeAppenderType(() => event.target.value);
    },
    handleRotationCountChange: ({ changeRotationCount }): Function => (
      event: Object
    ): void => {
      event.persist();

      changeRotationCount(() => event.target.value);
    },
    handleArchivePatternChange: ({ changeArchivePattern }): Function => (
      event: Object
    ): void => {
      event.persist();

      changeArchivePattern(() => event.target.value);
    },
    handleSubmit: ({
      name,
      layoutPattern,
      filename,
      encoding,
      appenderType,
      rotationCount,
      archivePattern,
      changeError,
      id,
      resource,
      dispatch,
      onCancel,
      changeAdding,
    }: NewAppenderPopoverProps): Function => async (): any => {
      if (name === '' || appenderType === '') {
        changeError(() => 'Name and Appender Type fields are required.');
      } else {
        changeAdding(() => true);

        const fetchRes: Object = await fetchWithNotifications(
          async () =>
            post(
              `${settings.REST_BASE_URL}/${resource}/${id}/logger/appenders`,
              {
                body: JSON.stringify({
                  name,
                  layoutPattern,
                  filename,
                  encoding,
                  appenderType,
                  rotationCount,
                  archivePattern,
                }),
              }
            ),
          `Adding new appender...`,
          `New appender successfuly added`,
          dispatch
        );

        if (fetchRes.err) {
          changeAdding(() => false);
          changeError(() => fetchRes.desc);
        } else {
          onCancel();
        }
      }
    },
  }),
  onlyUpdateForKeys([
    'name',
    'layoutPattern',
    'filename',
    'encoding',
    'appenderType',
    'error',
    'rotationCount',
    'archivePattern',
  ])
)(NewAppenderPopover);
