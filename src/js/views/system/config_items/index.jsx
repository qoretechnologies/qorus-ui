// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Flex from '../../../components/Flex';
import { connect } from 'react-redux';
import Box from '../../../components/box';
import ConfigItemsTable from '../../../components/ConfigItemsTable';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import Headbar from '../../../components/Headbar';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import pane from '../../../hocomponents/pane';
import GlobalConfigDetail from './pane';

type ConfigItemsViewProps = {};

const ConfigItemsView: Function = ({
  configItems,
}: ConfigItemsViewProps): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> Global config items </Crumb>
      </Breadcrumbs>
    </Headbar>
    <Box top fill noPadding>
      <ConfigItemsTable
        items={rebuildConfigHash(
          {
            name: 'Global Config',
            config: configItems,
          },
          false,
          true
        )}
        intrf="system"
      />
    </Box>
  </Flex>
);

export default compose(
  connect(state => ({
    configItems: state.api.system.globalConfig,
  })),
  pane(GlobalConfigDetail),
  onlyUpdateForKeys(['configItems'])
)(ConfigItemsView);
