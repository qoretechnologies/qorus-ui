// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import Transition from 'react-addons-css-transition-group';

type Props = {
  noPadding: boolean,
  top: boolean,
  noTransition: boolean,
  children: any,
  column: number,
};

const Box: Function = ({
  noPadding,
  children,
  top,
  column,
  noTransition,
}: Props): React.Element<any> =>
  noTransition ? (
    <div
      className="white-box"
      style={{
        padding: noPadding ? 0 : null,
        marginTop: top ? 0 : null,
        width: column ? `${100 / (column + column * 0.04)}%` : 'initial',
      }}
    >
      {children}
    </div>
  ) : (
    <Transition
      transitionName="bubble"
      transitionAppear
      transitionAppearTimeout={500000}
      transitionEnter={false}
      transitionLeave={false}
      component="div"
    >
      <div
        className="white-box"
        style={{
          padding: noPadding ? 0 : null,
          marginTop: top ? 0 : null,
          width: column ? `${100 / (column + column * 0.1)}%` : 'initial',
        }}
      >
        {children}
      </div>
    </Transition>
  );

export default pure(['noPadding', 'children'])(Box);
