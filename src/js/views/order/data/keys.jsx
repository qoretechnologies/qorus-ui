// @flow
import React from 'react';
import TreeView from './tree';

export default function KeysView(props: Object) {
  return <TreeView data="keys" order={props.order} withEdit />;
}
