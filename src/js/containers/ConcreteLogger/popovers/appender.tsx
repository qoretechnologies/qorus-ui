// @flow
import { FormGroup, InputGroup } from '@blueprintjs/core';
import includes from 'lodash/includes';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import Alert from '../../../components/alert';
import Box from '../../../components/box';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import settings from '../../../settings';
import { fetchWithNotifications, post, put } from '../../../store/api/utils';

type NewAppenderPopoverProps = {
  error?: string;
  name: string;
  level?: string;
  additivity: boolean;
  handleNameChange: Function;
  handleLevelChange: Function;
  handleAdditivityChange: Function;
  onCancel: Function;
  loggerLevels: Object;
  resource: string;
  id: number | string;
  changeError: Function;
  handleSubmit: Function;
  dispatch: Function;
  changeAdding: Function;
  isAdding: boolean;
  data?: Object;
};

const NewAppenderPopover: Function = ({
  error,
  name,
  handleNameChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'layoutPattern' does not exist on type 'N... Remove this comment to see the full error message
  layoutPattern,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleLayoutPatternChange' does not exis... Remove this comment to see the full error message
  handleLayoutPatternChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'filename' does not exist on type 'NewApp... Remove this comment to see the full error message
  filename,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleFilenameChange' does not exist on ... Remove this comment to see the full error message
  handleFilenameChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'encoding' does not exist on type 'NewApp... Remove this comment to see the full error message
  encoding,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleEncodingChange' does not exist on ... Remove this comment to see the full error message
  handleEncodingChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'appenderType' does not exist on type 'Ne... Remove this comment to see the full error message
  appenderType,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleAppenderTypeChange' does not exist... Remove this comment to see the full error message
  handleAppenderTypeChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'rotationCount' does not exist on type 'N... Remove this comment to see the full error message
  rotationCount,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleRotationCountChange' does not exis... Remove this comment to see the full error message
  handleRotationCountChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'archivePattern' does not exist on type '... Remove this comment to see the full error message
  archivePattern,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleArchivePatternChange' does not exi... Remove this comment to see the full error message
  handleArchivePatternChange,
  onCancel,
  handleSubmit,
  changeError,
  dispatch,
  isAdding,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'appendersTypes' does not exist on type '... Remove this comment to see the full error message
  appendersTypes,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'appendersFields' does not exist on type ... Remove this comment to see the full error message
  appendersFields,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
NewAppenderPopoverProps): React.Element<any> => (
  <Box fill top style={{ minWidth: '350px' }}>
    {error && <Alert bsStyle="danger">{error}</Alert>}
    <FormGroup label="Name " labelFor="appender-name">
      <InputGroup
        name="appender-name"
        id="appender-name"
        value={name}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onChange={handleNameChange}
      />
    </FormGroup>

    {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; label: string; required... Remove this comment to see the full error message */}
    <FormGroup label="Appender type " requiredLabel>
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Dropdown>
        {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message */}
        <Control>{appenderType || 'Please select'}</Control>
        {appendersTypes.map((appType: string) => (
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <Item key={appType} title={appType} onClick={handleAppenderTypeChange} />
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
      // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; label: string; labelFor... Remove this comment to see the full error message
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

    <ButtonGroup className="bp3-fill">
      <Button text="Cancel" icon="cross" onClick={onCancel} disabled={isAdding} />
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      appendersTypes: state.api.system.data.loggerParams.appenders_types,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      appendersFields: state.api.system.data.loggerParams.appenders_fields,
      appendersDefaults:
        // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
        state.api.system.data.loggerParams.default_appender_params,
    })
  ),
  withState('name', 'changeName', ({ data }) => data?.name || ''),
  withState('layoutPattern', 'changeLayoutPattern', ({ data }) => data?.layoutPattern),
  withState('filename', 'changeFilename', ({ data }) => data?.filename),
  withState('encoding', 'changeEncoding', ({ data }) => data?.encoding),
  withState('appenderType', 'changeAppenderType', ({ data }) => data?.type),
  withState('rotationCount', 'changeRotationCount', ({ data }) => data?.rotationCount || 0),
  withState('archivePattern', 'changeArchivePattern', ({ data }) => data?.archivePattern),
  withState('error', 'changeError', null),
  withState('isAdding', 'changeAdding', false),
  withHandlers({
    handleNameChange:
      ({ changeName }): Function =>
      (event: Object, value?: string): void => {
        if (event) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
          event.persist();
        }

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeName(() => (event ? event.target.value : value));
      },
  }),
  withHandlers({
    handleLayoutPatternChange:
      ({ changeLayoutPattern }): Function =>
      (event: Object, value?: string): void => {
        if (event) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
          event.persist();
        }

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeLayoutPattern(() => (event ? event.target.value : value));
      },
  }),
  withHandlers({
    handleFilenameChange:
      ({ changeFilename }): Function =>
      (event: Object, value?: string): void => {
        if (event) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
          event.persist();
        }

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeFilename(() => (event ? event.target.value : value));
      },
  }),
  withHandlers({
    handleEncodingChange:
      ({ changeEncoding }): Function =>
      (event: Object, value?: string): void => {
        if (event) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
          event.persist();
        }

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeEncoding(() => (event ? event.target.value : value));
      },
  }),
  withHandlers({
    handleRotationCountChange:
      ({ changeRotationCount }): Function =>
      (event: Object, value?: string): void => {
        if (event) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
          event.persist();
        }

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeRotationCount(() => (event ? event.target.value : value));
      },
  }),
  withHandlers({
    handleArchivePatternChange:
      ({ changeArchivePattern }): Function =>
      (event: Object, value?: string): void => {
        if (event) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
          event.persist();
        }

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeArchivePattern(() => (event ? event.target.value : value));
      },
  }),
  withHandlers({
    handleAppenderTypeChange:
      ({
        changeAppenderType,
        appendersDefaults,
        resource,
        data,
        handleFilenameChange,
        handleEncodingChange,
        handleLayoutPatternChange,
        handleArchivePatternChange,
        handleRotationCountChange,
        handleNameChange,
        name,
      }): Function =>
      (event: Object, appenderType: string): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
        event.persist();

        changeAppenderType(() => {
          // Set the filename default
          if (!data && appenderType !== 'LoggerAppenderStdOut') {
            let defaultFilename: string;

            switch (resource) {
              case 'jobs':
                defaultFilename = appendersDefaults[appenderType].filename.job;
                break;
              case 'services':
                defaultFilename = appendersDefaults[appenderType].filename.service;
                break;
              case 'workflows':
                defaultFilename = appendersDefaults[appenderType].filename.workflow;
                break;
              default:
                defaultFilename = appendersDefaults[appenderType].filename.system;
                break;
            }

            handleEncodingChange(null, appendersDefaults[appenderType].encoding);
            handleLayoutPatternChange(null, appendersDefaults[appenderType].layoutPattern);
            handleFilenameChange(null, defaultFilename);

            // Change also archive pattern and rotation count
            // for FileRotate appenders
            if (appenderType === 'LoggerAppenderFileRotate') {
              handleArchivePatternChange(null, appendersDefaults[appenderType].archivePattern);
              handleRotationCountChange(null, appendersDefaults[appenderType].rotationCount);
            }
          }

          // Only change name if it hasn't been set
          if (name === '') {
            handleNameChange(null, appendersDefaults[appenderType].name);
          }

          return appenderType;
        });
      },
  }),
  withHandlers({
    handleSubmit:
      ({
        name,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'layoutPattern' does not exist on type 'N... Remove this comment to see the full error message
        layoutPattern,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'filename' does not exist on type 'NewApp... Remove this comment to see the full error message
        filename,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'encoding' does not exist on type 'NewApp... Remove this comment to see the full error message
        encoding,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'appenderType' does not exist on type 'Ne... Remove this comment to see the full error message
        appenderType,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'rotationCount' does not exist on type 'N... Remove this comment to see the full error message
        rotationCount,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'archivePattern' does not exist on type '... Remove this comment to see the full error message
        archivePattern,
        changeError,
        id,
        resource,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'url' does not exist on type 'NewAppender... Remove this comment to see the full error message
        url,
        dispatch,
        onCancel,
        changeAdding,
        data,
      }: // @ts-ignore ts-migrate(1055) FIXME: Type 'any' is not a valid async function return ty... Remove this comment to see the full error message
      NewAppenderPopoverProps): Function =>
      async (): any => {
        if (!appenderType) {
          changeError(() => 'Appender Type field is required.');
        } else if (appenderType !== 'LoggerAppenderStdOut' && (!filename || filename === '')) {
          changeError(() => 'Filename is required for this type of appender');
        } else {
          changeAdding(() => true);

          const method = data ? put : post;
          const appendersPath: string = id
            ? `${typeof id === 'string' ? id.toLowerCase() : id}/logger/appenders`
            : 'logger/appenders';
          const fetchRes: Object = await fetchWithNotifications(
            async () =>
              method(`${settings.REST_BASE_URL}/${url || resource}/${appendersPath}`, {
                body: JSON.stringify({
                  name,
                  layoutPattern,
                  filename,
                  encoding,
                  appenderType,
                  rotationCount,
                  archivePattern,
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                  id: data?.id,
                }),
              }),
            data ? 'Editing appender' : `Adding new appender...`,
            data ? 'Appender successfuly edited' : `New appender successfuly added`,
            dispatch
          );

          // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
          if (fetchRes.err) {
            changeAdding(() => false);
            // @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
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
