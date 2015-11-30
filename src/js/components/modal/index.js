import React, { Component } from 'react';


import Content from './content';
import Header from './header';
import Body from './body';
import Footer from './footer';


/**
 * Keyboard event keyCode for Escape key.
 */
const ESCAPE_KEY_CODE = 27;


/**
 * Modal pane programmatically controlled by client components.
 *
 * This component is closely tied to its client components which
 * provide modal pane content. It uses client component's
 * `componentDidUpdate` to re-render modal pane content. Original
 * `componentDidUpdate` is preserved and called.
 *
 * In case when multiple components open pane, only the last
 * component's content is rendered. One component can render only one
 * modal pane content.
 *
 * Client component provides special render-like method which renders
 * modal pane content. This method can use components like
 * {@link Content}, {@link Header}, {@link Body} and {@link Footer} to
 * create full Bootstrap modal pane.
 */
export default class Modal extends Component {
  constructor(props) {
    super(props);

    this._comps = new Map();
    this._globalKeyUp = null;
    this.state = { content: null };
  }

  /**
   * Adds or removes global keyup event listener.
   *
   * Event listener is added if modal pane is rendered and not already
   * added. Otherwise, it is removed.
   */
  componentWillUpdate(nextProps, nextState) {
    if (nextState.content && !this._globalKeyUp) {
      this._globalKeyUp = this.onKeyUp.bind(this);
      document.addEventListener('keyup', this._globalKeyUp, false);
    } else if (this._globalKeyUp) {
      document.removeEventListener('keyup', this._globalKeyUp, false);
      this._globalKeyUp = null;
    }
  }

  /**
   * Calls pane header onClose event handler if present.
   */
  onEscape() {
    if (this.getHeader() && this.getHeader().props.onClose) {
      this.getHeader().props.onClose();
    }
  }

  /**
   * Listens to global key presses.
   *
   * If escape is pressed, it calls {@link onEscape}.
   */
  onKeyUp(e) {
    if (e.keyCode === ESCAPE_KEY_CODE) this.onEscape();
  }

  /**
   * Finds modal Header component in opened content children.
   *
   * @return {Header|null}
   */
  getHeader() {
    return this.state.content &&
      this.state.content.props &&
      this.state.content.props.children &&
      React.Children.toArray(this.state.content.props.children).
        find(el => el.type === Header);
  }

  /**
   * Opens modal pane using given components and its render method.
   *
   * Given `render` is always called with `comp` as a `thisArg`.
   *
   * It modifies `comp.componentDidUpdate` (see {@link addComp}).
   *
   * @param {ReactComponent} comp
   * @param {function(this: ReactComponent): ReactElement} render
   */
  open(comp, render) {
    this.addComp(comp, render);
    this.updateContent(comp);
  }

  /**
   * Closes modal pane for given component.
   *
   * It returns `comp.componentDidUpdate` to its original state via
   * {@link removeComp}.
   *
   * If there is other component which opened the modal pane, it uses
   * its render.
   *
   * @param {ReactComponent} comp
   */
  close(comp) {
    this.removeComp(comp);
    this.updateContent(this._comps.keys()[this._comps.size - 1]);
  }

  /**
   * Re-renders modal pane content with `comp`'s `render` result.
   *
   * It ensures that only the component which opened modal as the last
   * one will render pane's content.
   *
   * If `comp` is not give, it default to the last component which
   * opened the pane.
   *
   * @param {?ReactComponent} comp
   */
  updateContent(comp) {
    let lastComp;
    for (const c of this._comps.keys()) lastComp = c;

    if (comp && comp !== lastComp) return;

    this.setState({
      content: lastComp && this._comps.get(lastComp).render.apply(lastComp)
    });
  }

  /**
   * Adds component and its render method.
   *
   * It also extends `comp.componentDidUpdate` by wrapping it with
   * modal's implementation with modal pane content re-rendering (see
   * {@link updateContent}).
   *
   * @param {ReactComponent} comp
   * @param {function(): ReactElement} render
   */
  addComp(comp, render) {
    if (this._comps.has(comp)) return;

    this._comps.set(comp, {
      componentDidUpdate: comp.componentDidUpdate,
      render: render
    });

    comp.componentDidUpdate = (...args) => {
      if (this._comps.get(comp).componentDidUpdate) {
        this._comps.get(comp).componentDidUpdate.apply(comp, args);
      }

      this.updateContent(comp);
    };
  }

  /**
   * Removes comp from the list components which opened the pane.
   *
   * It returns `comp.componentDidUpdate` to its original state.
   *
   * @param {ReactComponent} comp
   */
  removeComp(comp) {
    if (!this._comps.has(comp)) return;

    if (this._comps.get(comp).componentDidUpdate) {
      comp.componentDidUpdate = this._comps.get(comp).componentDidUpdate;
    } else {
      delete comp.componentDidUpdate;
    }

    this._comps.delete(comp);
  }

  /**
   * Renders necessary elements around modal pane's content.
   *
   * If no content is set for rendering, nothing is rendered at all.
   *
   * @return {ReactElement|null}
   */
  render() {
    if (!this.state.content) return null;

    return (
      <div>
        <div
          className='modal fade'
          style={{ display: 'block' }}
          tabIndex='-1'
          role='dialog'
          aria-labelledby={this.getHeader() && this.getHeader().props.titleId}
        >
          <div className='modal-dialog' role='document'>
            {this.state.content}
          </div>
        </div>
        <div className='modal-backdrop fade in' />
      </div>
    );
  }
}


Modal.Content = Content;
Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;


export { Content, Header, Body, Footer };
