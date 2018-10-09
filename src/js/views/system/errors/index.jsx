/* @flow */
import React from 'react';

import ErrorsContainer from '../../../containers/errors';
import titleManager from '../../../hocomponents/TitleManager';

type Props = {
  location: Object,
};

const ErrorsView: Function = ({ location }: Props): React.Element<any> => (
  <ErrorsContainer
    title="Global errors"
    type="global"
    location={location}
    fixed
  />
);

export default titleManager('Errors')(ErrorsView);
