// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Flex from '../../../components/Flex';
import GlobalConfigItemsTable from '../../../components/GlobalConfigItemsTable';
import Headbar from '../../../components/Headbar';
import { arrayCollectionToObject } from '../../../helpers/interfaces';
import pane from '../../../hocomponents/pane';
import GlobalConfigDetail from './pane';

type ConfigItemsViewProps = {};

const ConfigItemsView: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
  configItems,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ConfigItemsViewProps): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> Global config items </Crumb>
      </Breadcrumbs>
    </Headbar>
    <Box top fill noPadding>
      <GlobalConfigItemsTable
        isGlobal
        globalItems={arrayCollectionToObject(configItems)}
        intrf="system"
      />
    </Box>
  </Flex>
);

export default compose(
  connect((state) => ({
    configItems: state.api.system.globalConfig,
  })),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 1.
  pane(GlobalConfigDetail),
  onlyUpdateForKeys(['configItems'])
)(ConfigItemsView);
