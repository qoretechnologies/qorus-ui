// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import SourceCode from '../../components/source_code';
import Loader from '../../components/loader';

import CodeAreaTitle from './title';

type Props = {
  selected: Object,
  height: any,
};

class CodeTab extends React.Component {
  props: Props;

  state: {
    height: any,
  } = {
    height: this.props.height || 'auto',
  };

  componentWillMount() {
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

  render() {
    const { selected } = this.props;
    const { height } = this.state;

    return (
      <div>
        {selected.item ? (
          <CodeAreaTitle item={selected.item} />
        ) : (
          <h5>{selected.name}</h5>
        )}
        {selected.loading ? (
          <Loader />
        ) : (
          <SourceCode handleRef={this.handleRef} height={height}>
            {selected.code}
          </SourceCode>
        )}
      </div>
    );
  }
}

export default pure(['selected', 'height'])(CodeTab);
