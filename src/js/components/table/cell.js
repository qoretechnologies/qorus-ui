import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Table data cell (usually td or th) component.
 *
 * It is essentially a placeholder for given prop comp which is by
 * default td element.
 *
 * If no child is given, it uses field prop to extract a field from
 * props prop used as cell value.
 *
 * If there are children, the props prop is destructured and passed to
 * all of them.
 */
@pureRender
export default class Cell extends Component {
  static propTypes = {
    children: React.PropTypes.node,
    comp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    props: PropTypes.object,
    field: PropTypes.string,
    childProps: PropTypes.object
  };

  static defaultProps = {
    comp: 'td',
    props: {},
    childProps: {}
  };

  getRootProps() {
    if (!this.props.field) return this.props.props;

    const rootProps = Object.assign({}, this.props.props);
    delete rootProps[this.props.field];

    return rootProps;
  }

  /**
   * Returns whatever will be used as root cell component children.
   *
   * If there are children defined, it uses them. If there is field
   * prop defined, it takes value of this field from props
   * prop. Otherwise, it will iterate over props prop properties and
   * contacatenates them with a single space.
   *
   * @return {ReactNode|null}
   */
  renderChildren() {
    return React.Children.count(this.props.children) ?
      this.renderChildrenProps() :
      this.renderChildrenField();
  }

  renderChildrenProps() {
    return React.Children.map(this.props.children, c => (
      React.isValidElement(c) ?
        React.cloneElement(c, this.props.childProps) :
        c
    ));
  }

  renderChildrenField() {
    return this.props.field ?
      this.props.props[this.props.field] :
      null;
  }

  render() {
    return React.createElement(
      this.props.comp,
      this.getRootProps(),
      ...React.Children.toArray(this.renderChildren())
    );
  }
}
