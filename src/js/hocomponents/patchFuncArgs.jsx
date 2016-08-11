/* @flow */
import React from 'react';

export default (
  funcName: string,
  funcArgsList: Array<string>
) => (Component: any) => {
  const WrappedComponent: Function = (props): React.Element<any> => {
    const func = props[funcName];
    const funcArgs = funcArgsList.map(arg => props[arg] || arg);
    const updatedFunc = (...args) => func(...funcArgs, ...args);
    const newProps = Object.assign({}, props, {
      [funcName]: updatedFunc,
    });

    return <Component {...newProps} />;
  };

  WrappedComponent.displayName = `patched(${Component.displayName})`;

  return WrappedComponent;
};
