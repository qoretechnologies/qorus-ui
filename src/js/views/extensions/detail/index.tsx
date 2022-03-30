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


// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ExtensionDetail = ({ extension }:{ extension: Object }): React.Element<any> => (
  <div
    dangerouslySetInnerHTML={{
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  const extensionList = state.api.extensions.data;

  const extension = extensionList.find(item => item.name === extensionName) || {};
  return { extension };
};

export default compose(
  prepareToLoadExtension,
  connect(
    extensionSelector,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'extensions' does not exist on type '{}'.
      load: actions.extensions.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'extensions' does not exist on type '{}'.
      unsync: actions.extensions.unsync,
    }
  ),
  patch('load', ['extensionQuery', 'extensionName']),
  sync('extension', false),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ extension }: { extension: Object }): boolean => !!extension.url),
  unsync()
)(ExtensionDetail);
