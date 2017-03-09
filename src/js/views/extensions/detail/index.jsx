/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';

import actions from '../../../store/api/actions';
import patch from '../../../hocomponents/patchFuncArgs';
import sync from '../../../hocomponents/sync';
import unsync from '../../../hocomponents/unsync';
import showIfPassed from '../../../hocomponents/show-if-passed';


const ExtensionDetail = ({ extension }:{ extension: Object }): React.Element<any> => (
  <div
    dangerouslySetInnerHTML={{
      __html: `<iframe class="extension-iframe" src="${extension.url}" />`,
    }}
  />
);


const prepareToLoadExtension = mapProps(
  props => ({
    ...props,
    extensionName: props.params.name,
    extensionQuery: {},
  })
);

const extensionSelector = (state: Object, { extensionName }: { extensionName: string }) => {
  const extensionList = state.api.extensions.data;

  const extension = extensionList.find(item => item.name === extensionName) || {};
  return { extension };
};

export default compose(
  prepareToLoadExtension,
  connect(
    extensionSelector,
    {
      load: actions.extensions.fetch,
      unsync: actions.extensions.unsync,
    }
  ),
  patch('load', ['extensionQuery', 'extensionName']),
  sync('extension', false),
  showIfPassed(({ extension }: { extension: Object }): boolean => !!extension.url),
  unsync()
)(ExtensionDetail);
