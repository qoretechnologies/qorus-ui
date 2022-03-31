/* @flow */
import React, { Component } from 'react';
import Loader from '../../../components/loader';
import DetailPane from '../../../components/pane';
import settings from '../../../settings';
import { get } from '../../../store/api/utils';

export default class GlobalConfigDetail extends Component {
  props: {
    paneId: string;
  } = this.props;

  state: {
    data: Object;
  } = {
    data: null,
  };

  componentWillMount() {
    this.loadConfigItem(this.props.paneId);
  }

  componentWillReceiveProps(nextProps: Object) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'paneId' does not exist on type 'Object'.
    if (this.props.paneId !== nextProps.paneId) {
      this.setState({ data: null });
      // @ts-ignore ts-migrate(2339) FIXME: Property 'paneId' does not exist on type 'Object'.
      this.loadConfigItem(nextProps.paneId);
    }
  }

  // @ts-ignore ts-migrate(1055) FIXME: Type 'void' is not a valid async function return t... Remove this comment to see the full error message
  loadConfigItem: Function = async (name: string): void => {
    const data = await get(`${settings.REST_BASE_URL}/system/config/${name}`);

    this.setState({
      data,
    });
  };

  handleClose: Function = (): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'onClose' does not exist on type '{ paneI... Remove this comment to see the full error message
    this.props.onClose();
  };

  render() {
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
