import React, { Component, PropTypes } from 'react';


import Header from './header';
import Body from './body';
import Footer from './footer';


import { pureRender } from '../utils';


/**
 * Modal pane component.
 */
@pureRender
export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  /**
   * Finds modal Header component in children.
   *
   * @return {Header|null}
   */
  getHeader() {
    return React.Children.toArray(this.props.children).filter(c => (
      c.type === Header
    ))[0] || null;
  }

  /**
   * Renders necessary elements around modal pane's content.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div
        className='modal fade in'
        style={{ display: 'block' }}
        tabIndex='-1'
        role='dialog'
        aria-labelledby={this.getHeader() && this.getHeader().props.titleId}
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}


Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;


export Manager from './manager';
