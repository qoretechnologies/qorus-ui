import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';
import clNs from 'classnames';
import { pureRender, pureRenderOmit } from './utils';
import { whenDefaultEnabled } from 'utils';

@pureRender
class Table extends Component {
  static propTypes = {
    children: PropTypes.node,
    collection: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string,
    rowClick: PropTypes.func
  }

  static defaultProps = {
    rowClick: () => {}
  }

  renderHeader() {
    return (
      <thead>
        <tr>
        { React.Children.map(this.props.children, (item) => {
          return (
            <Th className={ item.props.className }>{ item.props.name || '' }</Th>
          );
        })}
        </tr>
      </thead>
    );
  }

  renderBody() {
    let elements;
    const { collection, children, rowClick } = this.props;

    elements = {};

    collection.forEach((item) => {
      elements[`item-${item.id}`] = (
        <Row
          key={`row-${item.id}`}
          model={ item }
          onClick={ whenDefaultEnabled(() => { rowClick(item.id); }) }>
          { React.Children.map(children, (child) => {
            const { dataKey, cellClassName } = child.props;
            let childs = child.props.children;
            const onClick = child.props.cellOnClick ?
              child.props.onCellClick : '';

            const cls = cellClassName || '';

            const props = {};
            if (child.props.transMap &&
                React.Children.count(childs) === 1) {
              props.id = item.id;

              Object.keys(child.props.transMap).forEach(key => {
                if (key in item) {
                  props[child.props.transMap[key]] = item[key];
                }
              });
            }
            if (child.props.passItemAs &&
                React.Children.count(childs) === 1) {
              props[child.props.passItemAs] = item;
            }
            if (Object.keys(props).length > 0) {
              childs = React.Children.map(childs, c => {
                return <c.type {...c.props} {...props} />;
              });
            }

            return (
              <Td onClick={ onClick }
                  className={ cls }
                  model={ item }>
                { dataKey ? item[dataKey] : childs }
              </Td>
            );
          })}
        </Row>
      );
    });

    return (
      <tbody>
        { createFragment(elements) }
      </tbody>
    );
  }

  renderFooter() {
    return (
      <tfoot />
    );
  }

  render() {
    const { className } = this.props;

    return (
      <table className={ clNs(className) }>
        { this.renderHeader() }
        { this.renderBody() }
      </table>
    );
  }
}

export default Table = Table;

// @pureRender(['onClick', 'children'])
export class Row extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    model: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func
  }

  render() {
    const { className, children, onClick } = this.props;

    return (
      <tr className={ clNs(className) } onClick={ onClick }>
        { children }
      </tr>
    );
  }
}

@pureRenderOmit(['onClick', 'children'])
export class Td extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.any
  }

  render() {
    const { children, className, onClick } = this.props;
    const content = children;

    return (
      <td
        className={ className }
        onClick={ onClick ? () => onClick.bind(this) : null }>
        { content }
      </td>
    );
  }
}

@pureRender
export class Th extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  }

  render() {
    const { children, className } = this.props;
    const content = children;

    return (
      <th className={ clNs(className) }>
        { content }
      </th>
    );
  }
}

@pureRender
export class Cell extends Component {
  render() {
    return <Td {...this.props} />;
  }
}

// @pureRender
export class Col extends Component {
  static propTypes = {
    cellClassName: PropTypes.string,
    cellOnClick: PropTypes.func
  }

  static defaultProps = {
    cellClassName: null
  }

  render() {
    return <span />;
  }
}
