// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Breadcrumbs, CrumbTabs } from '../breadcrumbs';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control, Controls } from '../controls';
import Flex from '../Flex';
import Headbar from '../Headbar';
import ResizeHandle from '../resize/handle';

type Props = {
  width?: number;
  onClose: Function;
  children: any;
  onResize?: Function;
  title?: string;
  tabs?: any;
};

const Pane: Function = ({
  width,
  onClose,
  children,
  onResize,
  title,
  tabs,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
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
        // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: string; style: { float: "left"; ... Remove this comment to see the full error message
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
            // @ts-ignore ts-migrate(2339) FIXME: Property 'tabs' does not exist on type 'Object'.
            tabs={tabs.tabs}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'queryIdentifier' does not exist on type ... Remove this comment to see the full error message
            queryIdentifier={tabs.queryIdentifier}
            isPane
          />
        )}
      </Breadcrumbs>
    </Headbar>
    <Flex className="pane__content">{children}</Flex>
    {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ onStop: Function; left: true; min: { width... Remove this comment to see the full error message */}
    <ResizeHandle onStop={onResize} left min={{ width: 600 }} />
  </Flex>
);

export default compose(pure(['width', 'children', 'tabs']), injectIntl)(Pane);
