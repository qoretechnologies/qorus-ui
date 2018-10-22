// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import ResizeHandle from '../resize/handle';
import { Breadcrumbs, Crumb } from '../breadcrumbs';
import Headbar from '../Headbar';
import Pull from '../Pull';
import { Controls, Control } from '../controls';

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
    <Headbar>
      {title && (
        <Breadcrumbs>
          <Crumb active>{title}</Crumb>
        </Breadcrumbs>
      )}
      <Pull right>
        <Controls>
          <Control text="Close" iconName="cross" onClick={onClose} big />
        </Controls>
      </Pull>
    </Headbar>
    <div className="pane__content">{children}</div>
    <ResizeHandle onStop={onResize} left min={{ width: 400 }} />
  </div>
);

export default pure(['width', 'children'])(Pane);
