import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';

import actions from '../../../store/api/actions';
import patch from '../../../hocomponents/patchFuncArgs';
import sync from '../../../hocomponents/sync';


const ExtensionDetail = () => (
  <div>here will be extensions application</div>
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
      loadExtensionData: actions.extensions.loadExtensionData,
    }
  ),
  patch('load', ['extensionQuery', 'extensionName']),
  sync('extension', false)
)(ExtensionDetail);
