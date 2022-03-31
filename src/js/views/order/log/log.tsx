/* @flow */
import React from 'react';
import LogContainer from '../../../containers/log';

type Props = {
  resource: string;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const LogTab: Function = (props: Props): React.Element<any> => <LogContainer {...props} />;

export default LogTab;
