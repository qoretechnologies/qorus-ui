/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import _ from 'lodash';

import ExtensionList from './list';
import Tabs, { Pane } from '../../components/tabs';
import Box from '../../components/box';
import actions from '../../store/api/actions';
import sync from '../../hocomponents/sync';
import unsync from '../../hocomponents/unsync';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import titleManager from '../../hocomponents/TitleManager';
import NoDataIf from '../../components/NoDataIf';
import Headbar from '../../components/Headbar';
import Flex from '../../components/Flex';

const Extensions = ({ extensions }: { extensions: Object }) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>Extensions</Crumb>
      </Breadcrumbs>
    </Headbar>
    <Box top>
      <NoDataIf
        condition={Object.keys(extensions).length === 0}
        title="There are no extensions installed"
      >
        <Tabs active={Object.keys(extensions)[0]} id="extensionsTabs">
          {Object.keys(extensions).map(item => (
            <Pane key={`extension_group_${item.toLowerCase()}`} name={item}>
              <ExtensionList extensions={extensions[item]} />
            </Pane>
          ))}
        </Tabs>
      </NoDataIf>
    </Box>
  </Flex>
);

const groupExtensions = mapProps(props => ({
  ...props,
  extensions: _.groupBy(props.extensions.data, item => item.group),
}));

export default compose(
  connect(
    state => ({ extensions: state.api.extensions }),
    {
      load: actions.extensions.fetch,
      unsync: actions.extensions.unsync,
    }
  ),
  sync('extensions'),
  groupExtensions,
  titleManager('Extensions'),
  unsync()
)(Extensions);
