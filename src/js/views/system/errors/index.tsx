/* @flow */
import React from 'react';
import ErrorsContainer from '../../../containers/errors';
import titleManager from '../../../hocomponents/TitleManager';

type Props = {
  location: Object;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ErrorsView: Function = ({ location }: Props): React.Element<any> => (
  <ErrorsContainer title="Global errors" type="global" location={location} fixed />
);

export default titleManager('Errors')(ErrorsView);
