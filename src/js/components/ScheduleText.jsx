// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Alert from './alert';
import cronstrue from 'cronstrue';

type ScheduleTextProps = {
  cron: string,
};

const ScheduleText: Function = ({
  cron,
}: ScheduleTextProps): React.Element<any> => {
  let message: string = '';
  let isError = false;

  try {
    message = cronstrue.toString(cron);
  } catch (e) {
    message = e;
    isError = true;
  }
  return (
    <Alert
      icon={isError ? 'warning-sign' : 'info-sign'}
      bsStyle={isError ? 'danger' : 'primary'}
    >
      {message}
    </Alert>
  );
};

export default compose(onlyUpdateForKeys(['cron']))(ScheduleText);
