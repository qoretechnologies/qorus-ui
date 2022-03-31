// @flow
import React from 'react';
import TreeView from './tree';

export default function KeysView(props: any) {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'order' does not exist on type 'Object'.
  return <TreeView data="keys" order={props.order} withEdit />;
}
