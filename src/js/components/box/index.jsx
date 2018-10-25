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
  style?: Object,
  leftTopPaddingOnly: boolean,
};

const Box: Function = ({
  noPadding,
  leftTopPaddingOnly,
  children,
  top,
  column,
  noTransition,
  style,
}: Props): React.Element<any> =>
  noTransition ? (
    <div
      className="white-box"
      style={{
        padding: noPadding ? 0 : leftTopPaddingOnly ? '10px 0 0 10px' : null,
        marginTop: top ? 0 : null,
        width: column ? `${100 / column - 0.3 * column}%` : 'initial',
        ...style,
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
          padding: noPadding ? 0 : leftTopPaddingOnly ? '10px 0 0 10px' : null,
          marginTop: top ? 0 : null,
          width: column ? `${100 / (column + column * 0.1)}%` : 'initial',
          ...style,
        }}
      >
        {children}
      </div>
    </Transition>
  );

export default pure(['noPadding', 'leftTopPaddingOnly', 'children'])(Box);
