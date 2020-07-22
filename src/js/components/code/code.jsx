// @flow
import React from 'react';

import pure from 'recompose/onlyUpdateForKeys';

import Loader from '../../components/loader';
import SourceCode from '../../components/source_code';
import settings from '../../settings';
import { get } from '../../store/api/utils';
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
    isFsmLoaded: boolean,
  } = {
    height: this.props.height || 'auto',
    isFsmLoaded: !(this.props.selected.type === 'fsm'),
    fsmData: null,
  };

  async componentWillMount() {
    window.addEventListener('resize', this.recalculateSize);

    if (this.props.selected.type === 'fsm') {
      const data = await get(
        `${settings.REST_BASE_URL}/fsms/${this.props.selected.item.name}`
      );

      this.setState({
        fsmData: data,
        isFsmLoaded: true,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.recalculateSize);
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.selected.type === 'fsm') {
      const data = await get(
        `${settings.REST_BASE_URL}/fsms/${nextProps.selected.item.name}`
      );

      this.setState({
        fsmData: data,
        isFsmLoaded: true,
      });
    }
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
    const { height, isFsmLoaded, fsmData } = this.state;

    return (
      <Flex>
        {selected.item ? (
          <InfoHeader model={selected.item} />
        ) : (
          <h5>{selected.name}</h5>
        )}
        {selected.loading || !isFsmLoaded ? (
          <Loader />
        ) : (
          <>
            {selected.type === 'fsm' ? (
              <FSMView states={fsmData.states} />
            ) : (
              <SourceCode handleRef={this.handleRef} height={height}>
                {selected.code}
              </SourceCode>
            )}
          </>
        )}
      </Flex>
    );
  }
}

export default pure(['selected', 'height'])(CodeTab);
