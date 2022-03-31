/* @flow */
import React from 'react';

const Toolbar: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'className' does not exist on type 'Objec... Remove this comment to see the full error message
  className,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'marginBottom' does not exist on type 'Ob... Remove this comment to see the full error message
  marginBottom,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'mb' does not exist on type 'Object'.
  mb,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'mt' does not exist on type 'Object'.
  mt,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'children' does not exist on type 'Object... Remove this comment to see the full error message
  children,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Object) => (
  <div
    className={`${className} ${(marginBottom || mb) && 'margin-bottom'} ${
      mt && 'margin-top'
    } toolbar`}
    role="toolbar"
    style={{
      flex: '0 1 auto',
    }}
  >
    {children}
  </div>
);

export default Toolbar;
