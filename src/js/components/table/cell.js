import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Table data cell (usually td or th) component.
 *
 * It is essentially a placeholder for given prop comp which is by
 * default td element.
 *
 * If no child is given, it joins all given props with a single space
 * (' ') as a delimiter. It is expected that only one prop is given in
 * such cases.
 *
 * If there are children, the props are destructured and passed to all
 * of them.
 */
@pureRender
export default class Cell extends Component {
  static propTypes = {
    comp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    props: PropTypes.object
  }

  static defaultProps = {
    comp: 'td',
    props: {}
  }

  ensureChildren() {
    return React.Children.count(this.props.children) ?
      this.props.children :
      Object.keys(this.props.props).map(p => this.props.props[p]).join(' ');
  }

  render() {
    const { comp, props, children } = this.props;

    return React.createElement(
      comp,
      props,
      ...React.Children.toArray(this.ensureChildren())
    );
  }
}
