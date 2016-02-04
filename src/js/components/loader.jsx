import React, { Component } from 'react';


/**
 * Simple spinning loading indicator.
 */
export default class Loader extends Component {
  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <p><i className="fa fa-spinner fa-spin" /> Loading</p>
    );
  }
}
