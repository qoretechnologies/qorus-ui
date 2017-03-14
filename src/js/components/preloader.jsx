// @flow
import React from 'react';
import pure from 'recompose/pure';

import { CenterWrapper } from './layout';

const Preloader: Function = (): React.Element<any> => (
  <CenterWrapper>
    <div className="preloader loading">
      <span className="slice"></span>
      <span className="slice"></span>
      <span className="slice"></span>
      <span className="slice"></span>
      <span className="slice"></span>
      <span className="slice"></span>
    </div>
  </CenterWrapper>
);

export default pure(Preloader);
