// @flow
import React from 'react';

import pure from 'recompose/onlyUpdateForKeys';

import Loader from '../../components/loader';
import SourceCode from '../../components/source_code';
import Flex from '../Flex';
import FSMView from '../FSMDiagram';
import InfoHeader from '../InfoHeader';

type Props = {
  selected: Object,
  height: any,
};

class CodeTab extends React.Component {
  props: Props = this.props;

  state: {
    height: any,
  } = {
    height: this.props.height || 'auto',
  };

  async componentWillMount() {
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    window.addEventListener('resize', this.recalculateSize);
  }

  componentWillUnmount() {
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    window.removeEventListener('resize', this.recalculateSize);
  }

  el: any;

  handleRef: Function = (el): void => {
    if (!this.el) {
      this.el = el;

      this.recalculateSize();
    }
  };

  recalculateSize: Function = (): void => {
    if (this.el) {
      const { top } = this.el.getBoundingClientRect();

      this.setState({
        height: window.innerHeight - top - 60,
      });
    }
  };

  renderContent = () => {
    const { selected } = this.props;
    const { height } = this.state;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
    switch (selected.type) {
      case 'fsm':
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
        return <FSMView fsmName={this.props.selected.item.name} />;
      case 'pipeline':
        return <p>pipeline</p>;
      default:
        return (
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          <SourceCode handleRef={this.handleRef} height={height}>
            { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'. */ }
            {selected.code}
          </SourceCode>
        );
    }
  };

  render() {
    const { selected } = this.props;

    return (
      <Flex>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'. */ }
        {selected.item ? (
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
          <InfoHeader model={selected.item} />
        ) : (
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          <h5>{selected.name}</h5>
        )}
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'loading' does not exist on type 'Object'... Remove this comment to see the full error message */ }
        {selected.loading ? <Loader /> : <>{this.renderContent()}</>}
      </Flex>
    );
  }
}

export default pure(['selected', 'height'])(CodeTab);
