import React from 'react';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux-devtools' or its corresp... Remove this comment to see the full error message
import { createDevTools } from 'redux-devtools';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux-devtools-log-monitor' or... Remove this comment to see the full error message
import LogMonitor from 'redux-devtools-log-monitor';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux-devtools-dock-monitor' o... Remove this comment to see the full error message
import DockMonitor from 'redux-devtools-dock-monitor';

const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={false}
  >
    <LogMonitor theme="tomorrow" />
  </DockMonitor>
);

export default DevTools;
