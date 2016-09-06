/* @flow */
import React, { Component } from 'react';
import { pureRender } from '../utils';

/**
 * Keyboard event keyCode for Escape key.
 */
const ESCAPE_KEY_CODE = 27;

/**
 * Container component to programmatically handle modal panes.
 *
 * It is suggested to place this component near the end of component
 * tree to make sure nothing is rendered above.
 *
 * Modal manager does not re-render opened modal. Modal element itself
 * (or something else) is responsible for managing its state and
 * triggering render.
 */
@pureRender
export default class Manager extends Component {
  state: {
    modal: ?React.Element<any>,
  };

  state = {
    modal: (null: ?React.Element<any>),
  };

  /**
   * Sets up storage for modals to manage and state for current modal.
   */
  componentWillMount(): void {
    this._modals = new Set();
  }

  /**
   * Adds or removes global `keyup` listener and body status class.
   *
   * Event listener is added if modal pane is rendered and not already
   * added. Otherwise, it is removed.
   *
   * If a modal pane is rendered, `modal-open` class is added to
   * document body.
   *
   * @param {object} nextProps
   * @param {object} nextState
   */
  componentWillUpdate(nextProps: Object, nextState: Object): void {
    if (nextState.modal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    if (nextState.modal && !this._globalKeyUp) {
      this._globalKeyUp = this.onKeyUp;
      document.addEventListener('keyup', this._globalKeyUp, false);
    } else if (this._globalKeyUp) {
      document.removeEventListener('keyup', this._globalKeyUp, false);
      this._globalKeyUp = null;
    }
  }


  /**
   * Removes global `keyup` listener and `modal-open` class from body.
   */
  componentWillUnmount(): void {
    if (this._globalKeyUp) {
      document.removeEventListener('keyup', this._globalKeyUp, false);
      this._globalKeyUp = null;
    }

    document.body.classList.remove('modal-open');

    this._modals = null;
  }

  _root: ?Object = null;
  _modals: ?Set<*> = null;
  _globalKeyUp: ?EventHandler = null;

  /**
   * Triggers modal's close button.
   */
  onEscape() {
    const closeButton = this.getCloseButton();

    if (closeButton) {
      closeButton.click();
    }
  }

  /**
   * Listens to global key presses.
   *
   * If escape is pressed, it calls {@link onEscape}.
   *
   * @param {KeyboardEvent} ev
   */
  onKeyUp: Function = (ev: KeyboardEvent): void => {
    if (ev.keyCode && ev.keyCode === ESCAPE_KEY_CODE) {
      this.onEscape();
    }
  };

  /**
   * Finds modal close button in modal's header section.
   *
   * @return {HTMLButtonElement|null}
   */
  getCloseButton(): ?Object {
    if (this._root) {
      return this._root.querySelector('.modal-header button.close');
    }

    return null;
  }

  /**
   * Opens modal pane using given React element.
   *
   * @param {ReactElement} modal
   */
  open(modal: React.Element<any>): void {
    if (this._modals) {
      this._modals.add(modal);
      this.updateModal(modal);
    }
  }

  /**
   * Closes modal pane with given React element.
   *
   * If there is other element which was opened before given modal
   * element, it is re-opened.
   *
   * @param {ReactElement} modal
   */
  close(modal: React.Element<any>): void {
    if (this._modals) {
      this._modals.delete(modal);
      this.updateModal();
    }
  }

  /**
   * Re-renders modal pane content with last modal element added.
   *
   * If modal element is given, it checks if it is actually the last
   * opened element. If not, nothing is changed. If so, it is set to
   * be rendered.
   *
   * @param {?ReactElement} modal
   */
  updateModal(modal: ?React.Element<any>): void {
    const modals: ?Set<*> = this._modals;

    if (modals) {
      const values: ?Object = modals.values();

      if (values) {
        let lastModal: ?React.Element<any>;

        for (const m of values) lastModal = m;

        if (modal && modal !== lastModal) return;

        this.setState({ modal: lastModal });
      }
    }
  }

  /**
   * Stores root element for later reference.
   *
   * @param {HTMLElement} el
   */
  refRoot: Function = (el: Object): void => {
    this._root = el;
  };

  /**
   * Renders modal element and backdrop.
   *
   * If no modal element is opened, nothing is rendered at all.
   *
   * @return {ReactElement|null}
   */
  render(): ?React.Element<any> {
    if (!this.state.modal) return null;

    return (
      <div className="modal-root" ref={this.refRoot}>
        {this.state.modal}
        {this.state.modal && <div className="modal-backdrop fade in" />}
      </div>
    );
  }
}
