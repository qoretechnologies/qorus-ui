/* @flow */
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import setDisplayName from 'recompose/setDisplayName';

// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control } from '../controls';
import showIfLoaded from '../../hocomponents/show-if-loaded';
import showIfPassed from '../../hocomponents/show-if-passed';

export default compose(
  setDisplayName('LoadMoreBtn'),
  showIfLoaded('dataObject'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(props => props.dataObject.hasMore),
  mapProps(props => ({
    label: 'Load 50 more...',
    btnStyle: 'info',
    className: 'load-more',
    big: true,
    onClick: props.onLoadMore,
  }))
)(Control);
