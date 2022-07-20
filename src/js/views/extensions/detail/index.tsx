/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import patch from '../../../hocomponents/patchFuncArgs';
import showIfPassed from '../../../hocomponents/show-if-passed';
import sync from '../../../hocomponents/sync';
import unsync from '../../../hocomponents/unsync';
import actions from '../../../store/api/actions';

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ExtensionDetail = ({ extension }: { extension: any }) => (
  <div
    dangerouslySetInnerHTML={{
      // @ts-ignore ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
      __html: `<iframe class="extension-iframe" src="${extension.url}" />`,
    }}
  />
);

const prepareToLoadExtension = mapProps((props) => ({
  ...props,
  extensionName: props.params.name,
  extensionQuery: {},
}));

const extensionSelector = (state: any, { extensionName }: { extensionName: string }) => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  const extensionList = state.api.extensions.data;

  const extension = extensionList.find((item) => item.name === extensionName) || {};
  return { extension };
};

export default compose(
  prepareToLoadExtension,
  connect(extensionSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'extensions' does not exist on type '{}'.
    load: actions.extensions.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'extensions' does not exist on type '{}'.
    unsync: actions.extensions.unsync,
  }),
  patch('load', ['extensionQuery', 'extensionName']),
  sync('extension', false),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ extension }: { extension: any }): boolean => !!extension.url),
  unsync()
)(ExtensionDetail);
