// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Breadcrumbs, CrumbTabs } from '../breadcrumbs';
import { Control, Controls } from '../controls';
import Flex from '../Flex';
import Headbar from '../Headbar';
import ResizeHandle from '../resize/handle';

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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      {title && (
        <h4 style={{ float: 'left' }} active>
          {title}
        </h4>
      )}
      <Controls>
        <Control
          text={intl.formatMessage({ id: 'button.close' })}
          icon="cross"
          onClick={onClose}
          big
        />
      </Controls>
    </div>
    <Headbar>
      <Breadcrumbs icon="list-detail-view">
        {tabs && (
          <CrumbTabs
            tabs={tabs.tabs}
            queryIdentifier={tabs.queryIdentifier}
            isPane
          />
        )}
      </Breadcrumbs>
    </Headbar>
    <Flex className="pane__content">{children}</Flex>
    <ResizeHandle onStop={onResize} left min={{ width: 600 }} />
  </Flex>
);

export default compose(pure(['width', 'children', 'tabs']), injectIntl)(Pane);
