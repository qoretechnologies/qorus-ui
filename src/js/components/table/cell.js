import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Table data cell (usually td or th) component.
 *
 * It is essentially a placeholder for given prop comp which is by
 * default td element.
 *
 * If no child is given, it uses field prop to extract a field from
 * props prop used as cell value. If even field is not defined, it
 * joins all given props pro properties with a single space (' ') as a
 * delimiter. It is expected that only one prop is given in such
 * cases.
 *
 * If there are children, the props prop is destructured and passed to
 * all of them.
 */
@pureRender
export default class Cell extends Component {
  static propTypes = {
    comp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    props: PropTypes.object,
    field: PropTypes.string,
    childProps: PropTypes.object
  }

  static defaultProps = {
    comp: 'td',
    props: {},
    childProps: {}
  }

  /**
   * Returns whatever will be used as root cell component children.
   *
   * If there are children defined, it uses them. If there is field
   * prop defined, it takes value of this field from props
   * prop. Otherwise, it will iterate over props prop properties and
   * contacatenates them with a single space.
   */
  renderChildren() {
    if (React.Children.count(this.props.children)) {
      return this.renderChildrenProps();
    }

    if (this.props.field) {
      return this.props.props[this.props.field];
    }

    return Object.keys(this.props.props).
      map(p => this.props.props[p]).
      join(' ');
  }

  renderChildrenProps() {
    return React.Children.map(this.props.children, c => (
      React.isValidElement(c) ?
        React.cloneElement(c, this.props.childProps) :
        c
    ));
  }

  render() {
    const { comp, props, field, children } = this.props;

    return React.createElement(
      comp,
      props,
      ...React.Children.toArray(this.renderChildren())
    );
  }
}
