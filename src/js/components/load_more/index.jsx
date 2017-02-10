/* @flow */
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import setDisplayName from 'recompose/setDisplayName';

import { Control } from '../controls';
import showIfLoaded from '../../hocomponents/show-if-loaded';
import showIfPassed from '../../hocomponents/show-if-passed';


export default compose(
  setDisplayName('LoadMoreBtn'),
  showIfLoaded('dataObject'),
  showIfPassed(props => props.dataObject.hasMore),
  mapProps(props => ({
    label: 'Load 50 more...',
    btnStyle: 'success',
    className: 'load-more',
    big: true,
    onClick: props.onLoadMore,
  }))
)(Control);
