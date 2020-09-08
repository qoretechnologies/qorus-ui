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
    window.addEventListener('resize', this.recalculateSize);
  }

  componentWillUnmount() {
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

    switch (selected.type) {
      case 'fsm':
        return <FSMView fsmName={this.props.selected.item.name} />;
      case 'pipeline':
        return <p>pipeline</p>;
      default:
        return (
          <SourceCode handleRef={this.handleRef} height={height}>
            {selected.code}
          </SourceCode>
        );
    }
  };

  render() {
    const { selected } = this.props;

    return (
      <Flex>
        {selected.item ? (
          <InfoHeader model={selected.item} />
        ) : (
          <h5>{selected.name}</h5>
        )}
        {selected.loading ? <Loader /> : <>{this.renderContent()}</>}
      </Flex>
    );
  }
}

export default pure(['selected', 'height'])(CodeTab);
