// @flow
import React from 'react';
import capitalize from 'lodash/capitalize';
import pure from 'recompose/onlyUpdateForKeys';

import SourceCode from '../../components/source_code';
import InfoTable from '../../components/info_table';
import Loader from '../../components/loader';

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

  componentDidMount() {
    this.recalculateSize();
  }

  componentDidUpdate() {
    this.recalculateSize();
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
          <h5>
            {`${capitalize(selected.name)}
        ${selected.item.version ? `v${selected.item.version}` : ''}
        ${selected.item.id ? `(${selected.item.id})` : ''}`}
          </h5>
        ) : (
          <h5>{capitalize(selected.name)}</h5>
        )}
        {selected.item &&
          selected.type !== 'code' && (
            <InfoTable
              object={{
                author: selected.item.author,
                source: `${selected.item.source}:${selected.item.offset || ''}`,
                description: selected.item.description,
                tags:
                  selected.item.tags && Object.keys(selected.item.tags).length,
              }}
            />
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
