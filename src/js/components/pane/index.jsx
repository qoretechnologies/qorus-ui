// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import ResizeHandle from '../resize/handle';
import { Breadcrumbs, Crumb, CrumbTabs } from '../breadcrumbs';
import Headbar from '../Headbar';
import Pull from '../Pull';
import { Controls, Control } from '../controls';
import Flex from '../Flex';

type Props = {
  width?: number,
  onClose: Function,
  children: any,
  onResize?: Function,
  title?: string,
  tabs?: Object,
};

const Pane: Function = ({
  width,
  onClose,
  children,
  onResize,
  title,
  tabs,
}: Props) => (
  <Flex className="pane right" style={{ width }}>
    <Headbar>
      <Breadcrumbs iconName="list-detail-view">
        {title && <Crumb active>{title}</Crumb>}
        {tabs && (
          <CrumbTabs
            tabs={tabs.tabs}
            queryIdentifier={tabs.queryIdentifier}
            isPane
            //! Send pane width to resize the tabs
            width={width}
          />
        )}
      </Breadcrumbs>
      <Pull right>
        <Controls>
          <Control text="Close" iconName="cross" onClick={onClose} big />
        </Controls>
      </Pull>
    </Headbar>
    <Flex className="pane__content">{children}</Flex>
    <ResizeHandle onStop={onResize} left min={{ width: 600 }} />
  </Flex>
);

export default pure(['width', 'children', 'tabs'])(Pane);
