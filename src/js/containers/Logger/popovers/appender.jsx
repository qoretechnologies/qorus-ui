// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import withState from 'recompose/withState';
import Alert from '../../../components/alert';
import withHandlers from 'recompose/withHandlers';
import includes from 'lodash/includes';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import { connect } from 'react-redux';
import { fetchWithNotifications, post } from '../../../store/api/utils';
import settings from '../../../settings';
import Dropdown, { Item, Control } from '../../../components/dropdown';

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
  appendersTypes,
  appendersFields,
}: NewAppenderPopoverProps): React.Element<any> => (
  <Box fill top style={{ minWidth: '350px' }}>
    {error && <Alert bsStyle="danger">{error}</Alert>}
    <FormGroup label="Name " labelFor="appender-name">
      <InputGroup
        name="appender-name"
        id="appender-name"
        value={name}
        onChange={handleNameChange}
      />
    </FormGroup>

    <FormGroup label="Appender type " requiredLabel>
      <Dropdown>
        <Control>{appenderType || 'Please select'}</Control>
        {appendersTypes.map((appType: string) => (
          <Item
            key={appType}
            title={appType}
            onClick={handleAppenderTypeChange}
          />
        ))}
      </Dropdown>
    </FormGroup>

    {includes(appendersFields['layoutPattern'], appenderType) && (
      <FormGroup label="Layout pattern" labelFor="appender-layout">
        <InputGroup
          name="appender-layout"
          id="appender-layout"
          value={layoutPattern}
          onChange={handleLayoutPatternChange}
        />
      </FormGroup>
    )}

    {includes(appendersFields['filename'], appenderType) && (
      <FormGroup label="Filename " labelFor="appender-filename" requiredLabel>
        <InputGroup
          name="appender-filename"
          id="appender-filename"
          value={filename}
          onChange={handleFilenameChange}
        />
      </FormGroup>
    )}

    {includes(appendersFields['encoding'], appenderType) && (
      <FormGroup label="Encoding" labelFor="appender-encoding">
        <InputGroup
          name="appender-encoding"
          id="appender-encoding"
          value={encoding}
          onChange={handleEncodingChange}
        />
      </FormGroup>
    )}

    {includes(appendersFields['rotationCount'], appenderType) && (
      <FormGroup label="Rotation count" labelFor="appender-rotation">
        <InputGroup
          name="appender-rotation"
          id="appender-rotation"
          value={rotationCount}
          onChange={handleRotationCountChange}
        />
      </FormGroup>
    )}

    {includes(appendersFields['archivePattern'], appenderType) && (
      <FormGroup label="Archive pattern" labelFor="appender-archive">
        <InputGroup
          name="appender-archive"
          id="appender-archive"
          value={archivePattern}
          onChange={handleArchivePatternChange}
        />
      </FormGroup>
    )}

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
  connect(
    (state: Object): Object => ({
      appendersTypes: state.api.system.data.logger.appenders_types,
      appendersFields: state.api.system.data.logger.appenders_fields,
    })
  ),
  withState('name', 'changeName', ''),
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
      event: Object,
      appenderType: string
    ): void => {
      event.persist();

      changeAppenderType(() => appenderType);
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
      if (!appenderType) {
        changeError(() => 'Appender Type field is required.');
      } else if (
        appenderType !== 'LoggerAppenderStdOut' &&
        (!filename || filename === '')
      ) {
        changeError(() => 'Filename is required for this type of appender');
      } else {
        changeAdding(() => true);

        const appendersPath: string = id
          ? `${id}/logger/appenders`
          : 'logger/appenders';
        const fetchRes: Object = await fetchWithNotifications(
          async () =>
            post(`${settings.REST_BASE_URL}/${resource}/${appendersPath}`, {
              body: JSON.stringify({
                name,
                layoutPattern,
                filename,
                encoding,
                appenderType,
                rotationCount,
                archivePattern,
              }),
            }),
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
    'appendersTypes',
    'appendersFields',
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
