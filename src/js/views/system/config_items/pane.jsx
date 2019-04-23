/* @flow */
import React, { Component } from 'react';
import DetailPane from '../../../components/pane';
import { get } from '../../../store/api/utils';
import settings from '../../../settings';
import Loader from '../../../components/loader';

export default class GlobalConfigDetail extends Component {
  props: {
    paneId: string,
  } = this.props;

  state: {
    data: Object,
  } = {
    data: null,
  };

  componentWillMount () {
    this.loadConfigItem(this.props.paneId);
  }

  componentWillReceiveProps (nextProps: Object) {
    if (this.props.paneId !== nextProps.paneId) {
      this.setState({ data: null });
      this.loadConfigItem(nextProps.paneId);
    }
  }

  loadConfigItem: Function = async (name: string): void => {
    const data = await get(`${settings.REST_BASE_URL}/system/config/${name}`);

    this.setState({
      data,
    });
  };

  handleClose: Function = (): void => {
    this.props.onClose();
  };

  render () {
    const { paneId } = this.props;
    const { data } = this.state;

    if (!data) {
      return <Loader />;
    }

    return (
      <DetailPane width={600} onClose={this.handleClose} title={paneId}>
        {paneId}
      </DetailPane>
    );
  }
}
