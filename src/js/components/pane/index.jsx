// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Intent } from '@blueprintjs/core';

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
          iconName="cross"
          onClick={onClose}
          className="pt-small"
        />
      </div>
    </div>
    <div className="pane__content">{children}</div>
    <ResizeHandle onStop={onResize} left min={{ width: 400 }} />
  </div>
);

export default pure(['width', 'children'])(Pane);
