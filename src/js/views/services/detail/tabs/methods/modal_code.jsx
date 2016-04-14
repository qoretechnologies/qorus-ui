import React, { Component, PropTypes } from 'react';
import Modal from 'components/modal';


import _ from 'lodash';
import classNames from 'classnames';
import { pureRender } from 'components/utils';


@pureRender
export default class MethodModal extends Component {
  static propTypes = {
    actionLabel: PropTypes.string.isRequired,
    method: PropTypes.object.isRequired,
    onCommit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    requireChanges: PropTypes.bool,
  };


  static defaultProps = {
    requireChanges: false,
  };


  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this._form = null;

    this.state = {
      method: Object.assign({}, this.props.method),
      changes: null,
      status: {},
    };
  }


  /**
   * @param {Event} ev
   */
  onCommit(ev) {
    ev.preventDefault();

    if (this.validate()) {
      this.props.onCommit(this.state.method);
    }
  }


  /**
   * @param {Event} ev
   */
  onChange(ev) {
    this.setState({
      method: Object.assign({}, this.state.method, {
        [ev.target.name]: ev.target.type !== 'checkbox' ?
          ev.target.value :
          ev.target.checked,
      }),
    });
  }


  /**
   * @param {Event} ev
   */
  onBlur(ev) {
    this.validateElement(ev.target);

    if (this.state.changes === false) {
      this.validateChanges();
    }
  }


  /**
   * @return {boolean}
   */
  validate() {
    const els = this._form.querySelectorAll(
      '.form-group input, .form-group textarea'
    );
    for (let i = 0; i < els.length; i += 1) {
      if (!this.validateElement(els[i])) return false;
    }

    if (!this.validateChanges()) {
      return false;
    }

    return true;
  }


  /**
   * @param {Element} el
   * @return {boolean}
   */
  validateElement(el) {
    const status = Object.assign({}, this.state.status);

    if (el.checkValidity()) {
      delete status[el.id];
      this.setState({ status });
      return true;
    }

    if (el.validity.valueMissing) {
      status[el.id] = '(required value)';
    } else {
      status[el.id] = '(invalid value)';
    }
    this.setState({ status });

    return false;
  }


  /**
   * @return {boolean}
   */
  validateChanges() {
    if (!this.props.requireChanges) return true;

    const changes = !_.isEqual(this.props.method, this.state.method);
    this.setState({ changes });

    return changes;
  }


  /**
   * References error form.
   *
   * @param {HTMLFormElement} el
   */
  refForm(el) {
    this._form = el;
  }


  /**
   * @return {ReactElement}
   */
  render() {
    return (
      <Modal>
        <form
          className="form-horizontal"
          onSubmit={::this.onCommit}
          ref={::this.refForm}
          noValidate
        >
          <Modal.Header
            titleId="errorsTableModalLabel"
            onClose={this.props.onCancel}
          >
            {this.props.actionLabel} {this.props.method.name}
          </Modal.Header>
          <Modal.Body>
            <p>ModalBody</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {this.props.actionLabel}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
