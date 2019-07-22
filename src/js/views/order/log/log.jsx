/* @flow */
import React from 'react';
import LogContainer from '../../../containers/log';

type Props = {
  resource: string,
};

const LogTab: Function = (props: Props): React.Element<any> => (
  <LogContainer {...props} />
);

export default LogTab;
