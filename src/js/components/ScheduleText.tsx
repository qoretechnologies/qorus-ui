// @flow
import cronstrue from 'cronstrue';
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Alert from './alert';

type ScheduleTextProps = {
  cron: string;
};

const ScheduleText: Function = ({
  cron,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ScheduleTextProps) => {
  let message: string = '';
  let isError = false;

  try {
    message = cronstrue.toString(cron);
  } catch (e: any) {
    message = e;
    isError = true;
  }
  return (
    <Alert icon={isError ? 'warning-sign' : 'info-sign'} bsStyle={isError ? 'danger' : 'primary'}>
      {message}
    </Alert>
  );
};

export default compose(onlyUpdateForKeys(['cron']))(ScheduleText);
