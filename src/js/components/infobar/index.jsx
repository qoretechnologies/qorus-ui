// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import InfoBarItem from './item';

type Props = {
  children: any,
};

let InfoBar: Function = ({ children }: Props): React.Element<any> => (
  <div className="infobar">{children}</div>
);

InfoBar = pure(['children'])(InfoBar);

export {
  InfoBar,
  InfoBarItem,
};
