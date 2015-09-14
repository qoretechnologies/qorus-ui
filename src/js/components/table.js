import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';
import pureRender from 'pure-render-decorator';

@pureRender
class Table extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    collection: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string
  }

  renderHeader() {
    return (
      <thead>
        <tr>
        { React.Children.map(this.props.children, (item) => {
          return (
            <Th className={ item.props.className }>{ item.props.name }</Th>
          );
        })}
        </tr>
      </thead>
    );
  }

  renderBody() {
    const { collection, children } = this.props;

    return (
      <tbody>
        { collection.map((item) => {
          return (
            <Row key={`row-${item.id}`}>
              { React.Children.map(children, (child) => {
                const { dataKey } = child.props;
                const onClick = child.props.onCellClick ?
                  child.props.onCellClick : '';

                return (
                  <Td onClick={ onClick }>
                    { dataKey ? item[dataKey] : child.props.children }
                  </Td>
                );
              })}
            </Row>
          );
        })}
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

@pureRender
export class Row extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    model: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  render() {
    const { className, children } = this.props;

    return (
      <tr className={ clNs(className) }>
        { children }
      </tr>
    );
  }
}

@pureRender
export class Td extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func
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
  render() {
    return <span />;
  }
}
