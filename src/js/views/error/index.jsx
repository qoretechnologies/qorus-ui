// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { CenterWrapper } from '../../components/layout';

type Props = {

};

const ErrorView: Function = ({}: Props): React.Element<any> => (
  <CenterWrapper>
    Error vid
  </CenterWrapper>
);

export default pure(['children'])(ErrorView);
