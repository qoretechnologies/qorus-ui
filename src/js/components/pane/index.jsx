// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import ResizeHandle from '../resize/handle';
import { Breadcrumbs, Crumb, CrumbTabs } from '../breadcrumbs';
import Headbar from '../Headbar';
import Pull from '../Pull';
import { Controls, Control } from '../controls';
import Flex from '../Flex';
import { injectIntl } from 'react-intl';

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
  intl,
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
          />
        )}
      </Breadcrumbs>
      <Pull right>
        <Controls>
          <Control
            text={intl.formatMessage({ id: 'button.close' })}
            iconName="cross"
            onClick={onClose}
            big
          />
        </Controls>
      </Pull>
    </Headbar>
    <Flex className="pane__content">{children}</Flex>
    <ResizeHandle onStop={onResize} left min={{ width: 600 }} />
  </Flex>
);

export default compose(
  pure(['width', 'children', 'tabs']),
  injectIntl
)(Pane);
