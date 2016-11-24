/* @flow */
import React from 'react';

import ErrorsContainer from '../../../containers/errors';

type Props = {
  location: Object,
}

const ErrorsView: Function = ({ location }: Props): React.Element<any> => (
  <div className="tab-pane active">
    <ErrorsContainer
      title="Global errors"
      type="global"
      location={location}
    />
  </div>
);

export default ErrorsView;
