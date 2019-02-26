// @flow
import React from 'react';
import TreeView from './tree';

export default function StepDataView (props: Object) {
  return <TreeView data="stepdata" order={props.order} />;
}
