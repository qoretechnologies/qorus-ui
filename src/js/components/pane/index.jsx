// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Button } from '@blueprintjs/core';

import ResizeHandle from '../resize/handle';
import { Breadcrumbs, Crumb } from '../breadcrumbs';

type Props = {
  width?: number,
  onClose: Function,
  children: any,
  onResize?: Function,
  title?: string,
};

const Pane: Function = ({
  width,
  onClose,
  children,
  onResize,
  title,
}: Props) => (
  <div className="pane right" style={{ width }}>
    <div className="pane-header">
      {title && (
        <Breadcrumbs>
          <Crumb active>{title}</Crumb>
        </Breadcrumbs>
      )}
      <div className="pull-right">
        <Button
          text="Close"
          icon="cross"
          onClick={onClose}
          className="bp3-small"
        />
      </div>
    </div>
    <div className="pane__content">{children}</div>
    <ResizeHandle onStop={onResize} left min={{ width: 400 }} />
  </div>
);

export default pure(['width', 'children'])(Pane);
