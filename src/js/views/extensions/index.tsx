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
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        <Tabs active={Object.keys(extensions)[0]} id="extensionsTabs">
          {Object.keys(extensions).map(item => (
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; key: string; name: stri... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'extensions' does not exist on type '{}'.
      load: actions.extensions.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'extensions' does not exist on type '{}'.
      unsync: actions.extensions.unsync,
    }
  ),
  sync('extensions'),
  groupExtensions,
  titleManager('Extensions'),
  unsync()
)(Extensions);
