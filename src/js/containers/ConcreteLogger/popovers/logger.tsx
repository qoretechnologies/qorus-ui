// @flow
import { FormGroup, InputGroup } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import Alert from '../../../components/alert';
import Box from '../../../components/box';
import Checkbox from '../../../components/checkbox';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import settings from '../../../settings';
import { fetchWithNotifications, post, put } from '../../../store/api/utils';

type NewLoggerPopoverProps = {
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

const NewLoggerPopover: Function = ({
  error,
  name,
  level,
  additivity,
  handleNameChange,
  handleLevelChange,
  handleAdditivityChange,
  onCancel,
  loggerLevels,
  handleSubmit,
  changeError,
  dispatch,
  isAdding,
  data,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
NewLoggerPopoverProps): React.Element<any> => (
  <Box fill top style={{ minWidth: '350px' }}>
    {error && <Alert bsStyle="danger">{error}</Alert>}
    <FormGroup label="Name " labelFor="logger-name">
      <InputGroup
        name="logger-name"
        id="logger-name"
        value={name}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onChange={handleNameChange}
      />
    </FormGroup>
    {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; label: string; required... Remove this comment to see the full error message */}
    <FormGroup label="Level " requiredLabel>
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Dropdown>
        {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; }' is missing the follow... Remove this comment to see the full error message */}
        <Control>{level || 'Please select'}</Control>
        {Object.keys(loggerLevels).map((loggerLevel: string) => (
          <Item
            key={loggerLevel}
            title={loggerLevel}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onClick={handleLevelChange}
          />
        ))}
      </Dropdown>
    </FormGroup>
    <FormGroup label="Additivity">
      <Checkbox checked={additivity ? 'CHECKED' : 'UNCHECKED'} action={handleAdditivityChange} />
    </FormGroup>
    <ButtonGroup className="bp3-fill">
      <Button text="Cancel" icon="cross" onClick={onCancel} disabled={isAdding} />
      <Button
        disabled={isAdding}
        btnStyle="success"
        text={data ? 'Update' : 'Submit'}
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
      loggerLevels: state.api.system.data.loggerParams.logger_levels,
    })
  ),
  withState('name', 'changeName', ({ data }) => data?.name || 'MyCustomLogger'),
  withState('level', 'changeLevel', ({ data }) => data && Object.keys(data.level)[0]),
  withState('additivity', 'changeAdditivity', ({ data }) => data?.additivity || false),
  withState('error', 'changeError', null),
  withState('isAdding', 'changeAdding', false),
  withHandlers({
    handleNameChange:
      ({ changeName }): Function =>
      (event: Object): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
        event.persist();

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeName(() => event.target.value);
      },
    handleLevelChange:
      ({ changeLevel }): Function =>
      (event: Object, level: string): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
        event.persist();

        changeLevel(() => level);
      },
    handleAdditivityChange:
      ({ changeAdditivity }): Function =>
      (): void => {
        changeAdditivity((additivity) => !additivity);
      },
    handleSubmit:
      ({
        name,
        level,
        additivity,
        changeError,
        id,
        resource,
        dispatch,
        onCancel,
        changeAdding,
        data,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'isDefault' does not exist on type 'NewLo... Remove this comment to see the full error message
        isDefault,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'url' does not exist on type 'NewLoggerPo... Remove this comment to see the full error message
        url,
      }: // @ts-ignore ts-migrate(1055) FIXME: Type 'any' is not a valid async function return ty... Remove this comment to see the full error message
      NewLoggerPopoverProps): Function =>
      async (): any => {
        if (!level) {
          changeError(() => 'Level field is required.');
        } else {
          changeAdding(() => true);

          const fetchRes: Object = await fetchWithNotifications(
            async () => {
              const apiMethod: Function = data ? put : post;
              let loggerPath: string;

              if (id) {
                loggerPath = `/${typeof id === 'string' ? id.toLowerCase() : id}/logger`;
              } else if (isDefault) {
                loggerPath = '?action=defaultLogger';
              } else {
                loggerPath = 'logger';
              }

              return apiMethod(`${settings.REST_BASE_URL}/${url || resource}${loggerPath}`, {
                body: JSON.stringify({
                  level,
                  name,
                  additivity,
                }),
              });
            },
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            data ? `Updating logger ${data.name}...` : `Adding new logger...`,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            data ? `Logger ${data.name} updated` : `New logger successfuly added`,
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
  onlyUpdateForKeys(['name', 'level', 'isAdding', 'additivity', 'error'])
)(NewLoggerPopover);
