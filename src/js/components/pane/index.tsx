// @flow
import { ReqoreDrawer } from '@qoretechnologies/reqore';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Breadcrumbs, CrumbTabs } from '../breadcrumbs';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import Flex from '../Flex';
import Headbar from '../Headbar';

type Props = {
  width?: number;
  onClose: any;
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
}: Props) => {
  return (
    <ReqoreDrawer
      label={title}
      onClose={onClose}
      position="right"
      width={`${width}px`}
      minSize="650px"
      isOpen
      blur={5}
      floating
      hidable
      contentStyle={{ display: 'flex', flexFlow: 'column', height: '100%', overflow: 'hidden' }}
    >
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
    </ReqoreDrawer>
  );
};

export default compose(pure(['width', 'children', 'tabs']), injectIntl)(Pane);
