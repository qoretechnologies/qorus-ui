/* @flow */
import React from 'react';

export default (funcName: string, funcArgsList: Array<any>) => (Component: any) => {
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  const WrappedComponent: Function = (props): React.Element<any> => {
    const func = props[funcName];
    const funcArgs = funcArgsList.map((arg) => (props[arg] === 0 ? 0 : props[arg] || arg));
    const updatedFunc = (...args) => func(...funcArgs, ...args);
    const newProps = Object.assign({}, props, {
      [funcName]: updatedFunc,
    });

    return <Component {...newProps} />;
  };

  // @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'Fun... Remove this comment to see the full error message
  WrappedComponent.displayName = `patched(${Component.displayName})`;

  return WrappedComponent;
};
