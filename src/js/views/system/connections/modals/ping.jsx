import React, { Component, PropTypes } from 'react';

import Modal from 'components/modal';
import Loader from 'components/loader';
import InfoTable from 'components/info_table';

import { fetchJson } from 'store/api/utils';

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => {
      if (hasCanceled_) {
        return reject({ isCanceled: true });
      }

      return resolve(val);
    });

    promise.catch((error) => {
      if (hasCanceled_) {
        return reject({ isCanceled: true });
      }

      return reject(error);
    });
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export default class ModalPing extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    ping: PropTypes.func,
    data: PropTypes.object,
    model: PropTypes.object,
    params: PropTypes.object,
  };


  componentWillMount() {
    this.setState({
      response: null,
    });

    this._ping = this.ping();
  }

  componentWillUnmount() {
    this._ping.cancel();
  }

  ping = () => {
    const resp = makeCancelable(
      fetchJson(
        'PUT',
         `/api/remote/${this.props.params.type}/${this.props.model.name}?action=ping`
      )
    );

    resp.promise
      .then((r) => { this.setState({ response: r }); })
      .catch(() => {});

    return resp;
  }

  render() {
    return (
      <Modal>
        <Modal.Header
          onClose={this.props.onClose}
          titleId="system-connections-ping-modal"
        >
          Ping { this.props.model.name }
        </Modal.Header>
        <Modal.Body>
          {!this.state.response && <Loader message="Waiting for response..." />}
          {this.state.response &&
            <InfoTable object={this.state.response} /> }
        </Modal.Body>
      </Modal>
    );
  }
}
