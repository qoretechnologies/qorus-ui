// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import InfoBarItem from './item';

type Props = {
  children: any;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
let InfoBar: Function = ({ children }: Props) => <div className="infobar">{children}</div>;

InfoBar = pure(['children'])(InfoBar);

export { InfoBar, InfoBarItem };
