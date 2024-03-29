// @flow
import { ReqoreDrawer } from '@qoretechnologies/reqore';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Breadcrumbs, CrumbTabs } from '../breadcrumbs';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { IReqoreDrawerProps } from '@qoretechnologies/reqore/dist/components/Drawer';
import Flex from '../Flex';

type Props = {
  width?: number;
  onClose: any;
  children: any;
  onResize?: Function;
  title?: string;
  tabs?: any;
};

const Pane = ({ width, onClose, children, title, tabs, ...rest }: Props & IReqoreDrawerProps) => {
  return (
    <ReqoreDrawer
      {...rest}
      label={title}
      onClose={onClose}
      position="right"
      width={`${width}px`}
      minSize="650px"
      isOpen
      minimal
      blur={2}
      floating
      hidable
      contentStyle={{ display: 'flex', flexFlow: 'column', height: '100%', overflow: 'hidden' }}
    >
      {tabs && (
        <Breadcrumbs noIcon>
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
      )}
      <Flex className="pane__content">{children}</Flex>
    </ReqoreDrawer>
  );
};

export default compose(pure(['width', 'children', 'tabs', 'actions']), injectIntl)(Pane);
