// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import queryControl from '../../../hocomponents/queryControl';
import Dropdown, { Item, Control as DControl } from '../../../components/dropdown';
import { Control as Button, Controls } from '../../../components/controls';

type Props = {
  runningQuery: string,
  changeRunningQuery: Function,
  latestQuery: string,
  changeLatestQuery: Function,
  deprecatedQuery: string,
  changeDeprecatedQuery: Function,
}

const ToolbarFilters: Function = ({
  runningQuery,
  changeRunningQuery,
  latestQuery,
  changeLatestQuery,
  deprecatedQuery,
  changeDeprecatedQuery,
}: Props): React.Element<any> => (
  <Controls grouped noControls>
    <Button
      label="Running"
      big
      action={changeRunningQuery}
      icon={runningQuery ? 'check-square-o' : 'square-o'}
      btnStyle={runningQuery ? 'success' : 'default'}
    />
    <Button
      label="Last version"
      big
      action={changeLatestQuery}
      icon={latestQuery ? 'check-square-o' : 'square-o'}
      btnStyle={latestQuery ? 'success' : 'default'}
    />
    <Dropdown id="deprecated">
      <DControl
        btnStyle={deprecatedQuery ? 'success' : 'default'}
      />
      <Item
        title="Deprecated"
        icon={deprecatedQuery ? 'check-square-o' : 'square-o'}
        action={changeDeprecatedQuery}
      />
    </Dropdown>
  </Controls>
);

export default compose(
  queryControl('running', null, true),
  queryControl('latest', null, true),
  queryControl('deprecated', null, true),
  pure([
    'runningQuery',
    'latestQuery',
    'deprecatedQuery',
  ])
)(ToolbarFilters);
