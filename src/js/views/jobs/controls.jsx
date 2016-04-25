import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Controls, Control } from 'components/controls';

import { pureRender } from 'components/utils';

import actions from 'store/api/actions';


@pureRender
export default class ServiceControls extends Component {
  static propTypes = {
    job: PropTypes.object,
  };


  static contextTypes = {
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      dropdown: false,
    });
  }

  componentWillUnmount() {
    this.removeDropdownListener();
  }

  handleOutsideClick = (event) => {
    const el = ReactDOM.findDOMNode(this._dropdown);

    console.log(el,'wtf');

    if (!el.contains(event.target)) {
      this.setState({ dropdown: false });
    }
  }

  dispatchAction(action) {
    this.context.dispatch(
      actions.jobs[action](this.props.job)
    );
  }

  showDropdown = (ev) => {
    ev.preventDefault();
    if (!this.state.dropdown) {
      document.addEventListener('click', this.handleOutsideClick);
    } else {
      this.removeDropdownListener();
    }
    this.setState({ dropdown: !this.state.dropdown });
  }

  removeDropdownListener() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  refDropdown = (ref) => {
    console.log(ref);
    this._dropdown = ref;
  }

  render() {
    const dispatchDisable = () => this.dispatchAction('disable');
    const dispatchEnable = () => this.dispatchAction('enable');
    // const dispatchReset = () => this.dispatchAction('reset');
    const dispatchActivate = () => this.dispatchAction('setActive');
    const dispatchDeactivate = () => this.dispatchAction('setDeactive');

    return (
      <div>
        {this.props.job.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={dispatchDisable}
          />
        )}
        {!this.props.job.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={dispatchEnable}
          />
        )}
        {this.props.job.active && (
          <Control
            title="Deactivate"
            icon="check"
            btnStyle="success"
            action={dispatchDeactivate}
          />
        )}
        {!this.props.job.active && (
          <Control
            title="Actovate"
            icon="ban"
            btnStyle="danger"
            action={dispatchActivate}
          />
        )}
        <div
          ref={this.refDropdown}
          className={classNames('dropdown', this.state.dropdown ? 'open' : '')}
        >
          <Control
            title="More"
            icon="caret-down"
            action={this.showDropdown}
          />
          <ul className="dropdown-menu">
            <li><a href="#">Action</a></li>
          </ul>
        </div>
      </div>
    );
  }
}
