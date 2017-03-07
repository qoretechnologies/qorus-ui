/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import _ from 'lodash';

import ExtensionList from './list';
import Tabs, { Pane } from '../../components/tabs';
import actions from '../../store/api/actions';
import sync from '../../hocomponents/sync';
import unsync from '../../hocomponents/unsync';

const Extensions = ({ extensions }: { extensions: Object }) => (
  <div className="extensions">
    <h1>Extensions</h1>
    <Tabs>
      {Object.keys(extensions).map(item => (
        <Pane
          key={`extension_group_${item.toLowerCase()}`}
          name={item}
        >
          <ExtensionList extensions={extensions[item]} />
        </Pane>
      ))}
    </Tabs>
  </div>
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
  unsync(),
)(Extensions);
