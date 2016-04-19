// components
import React, { Component, PropTypes } from 'react';
import Modal from 'components/modal';
import Loader from 'components/loader';
import SourceCode from 'components/source_code';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { pureRender } from 'components/utils';
import { bindActionCreators } from 'redux';

import actions from 'store/api/actions';

const methodSelector = (store, props) => {
  const service = store.api.services.data.find(s => s.id === props.service.id);
  return service.methods.find(m => m.name === props.method.name);
};

const serviceSelector = (store, props) => (
  store.api.services.data.find(s => s.id === props.service.id)
);

const viewSelector = createSelector(
  [methodSelector, serviceSelector],
  (method, service) => ({
    method,
    service,
  })
);

@connect(
  viewSelector,
  dispatch => bindActionCreators({
    fetchSources: actions.services.fetchMethodSources,
  }, dispatch)
)
export default class ModalCode extends Component {
  static propTypes = {
    method: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchSources: PropTypes.func,
  };

  componentWillMount() {
    if (!this.props.method.body) {
      this.props.fetchSources(this.props.service);
    }
  }

  /**
   * Handles onClick event for closing the modal window
   */
  handleCancel = (ev) => {
    if (ev) ev.preventDefault();
    this.props.onClose();
  }

  /**
   * Returns loader if method body information are not available.
   *
   * @return {ReactElement}
   */
  renderLoader() {
    return (
      <Loader />
    );
  }

  /**
   * Returns method body source code.
   *
   * @return {ReactElement}
   */
  renderBody() {
    return (
      <SourceCode>
        {this.props.method.body}
      </SourceCode>
    );
  }

  /**
   * @return {ReactElement}
   */
  render() {
    return (
      <Modal>
        <Modal.Header
          titleId="methodsTableModalLabel"
          onClose={this.handleCancel}
        >
          Source code for {this.props.method.name}
        </Modal.Header>
        <Modal.Body>
          { this.props.method.body ? this.renderBody() : this.renderLoader() }
        </Modal.Body>
      </Modal>
    );
  }
}
