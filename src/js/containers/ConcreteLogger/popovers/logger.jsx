// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import Dropdown, { Item, Control } from '../../../components/dropdown';
import withState from 'recompose/withState';
import Alert from '../../../components/alert';
import withHandlers from 'recompose/withHandlers';
import Checkbox from '../../../components/checkbox';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import { connect } from 'react-redux';
import { fetchWithNotifications, post, put } from '../../../store/api/utils';
import settings from '../../../settings';

type NewLoggerPopoverProps = {
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
}: NewLoggerPopoverProps): React.Element<any> => (
  <Box fill top style={{ minWidth: '350px' }}>
    {error && <Alert bsStyle="danger">{error}</Alert>}
    <FormGroup label="Name " labelFor="logger-name">
      <InputGroup
        name="logger-name"
        id="logger-name"
        value={name}
        onChange={handleNameChange}
      />
    </FormGroup>
    <FormGroup label="Level " requiredLabel>
      <Dropdown>
        <Control>{level || 'Please select'}</Control>
        {Object.keys(loggerLevels).map((loggerLevel: string) => (
          <Item
            key={loggerLevel}
            title={loggerLevel}
            onClick={handleLevelChange}
          />
        ))}
      </Dropdown>
    </FormGroup>
    <FormGroup label="Additivity">
      <Checkbox
        checked={additivity ? 'CHECKED' : 'UNCHECKED'}
        action={handleAdditivityChange}
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
      loggerLevels: state.api.system.data.loggerParams.logger_levels,
    })
  ),
  withState('name', 'changeName', ({ data }) => data?.name || 'MyCustomLogger'),
  withState(
    'level',
    'changeLevel',
    ({ data }) => data && Object.keys(data.level)[0]
  ),
  withState(
    'additivity',
    'changeAdditivity',
    ({ data }) => data?.additivity || false
  ),
  withState('error', 'changeError', null),
  withState('isAdding', 'changeAdding', false),
  withHandlers({
    handleNameChange: ({ changeName }): Function => (event: Object): void => {
      event.persist();

      changeName(() => event.target.value);
    },
    handleLevelChange: ({ changeLevel }): Function => (
      event: Object,
      level: string
    ): void => {
      event.persist();

      changeLevel(() => level);
    },
    handleAdditivityChange: ({ changeAdditivity }): Function => (): void => {
      changeAdditivity(additivity => !additivity);
    },
    handleSubmit: ({
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
      isDefault,
      url,
    }: NewLoggerPopoverProps): Function => async (): any => {
      if (!level) {
        changeError(() => 'Level field is required.');
      } else {
        changeAdding(() => true);

        const fetchRes: Object = await fetchWithNotifications(
          async () => {
            const apiMethod: Function = data ? put : post;
            let loggerPath: string;

            if (id) {
              loggerPath = `/${id}/logger`;
            } else if (isDefault) {
              loggerPath = '?action=defaultLogger';
            } else {
              loggerPath = 'logger';
            }

            return apiMethod(
              `${settings.REST_BASE_URL}/${url || resource}${loggerPath}`,
              {
                body: JSON.stringify({
                  level,
                  name,
                  additivity,
                }),
              }
            );
          },
          data ? `Updating logger ${data.name}...` : `Adding new logger...`,
          data ? `Logger ${data.name} updated` : `New logger successfuly added`,
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
  onlyUpdateForKeys(['name', 'level', 'isAdding', 'additivity', 'error'])
)(NewLoggerPopover);
