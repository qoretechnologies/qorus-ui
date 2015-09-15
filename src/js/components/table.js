import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';
import pureRender from 'pure-render-decorator';


  // React.Children.map(childy, (c) => {
  //   <c {...c.props} model={ item } />;
  // })

@pureRender
class Table extends Component {
  static propTypes = {
    children: PropTypes.node,
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
            <Row key={`row-${item.id}`} model={ item }>
              { React.Children.map(children, (child) => {
                const { dataKey, cellClassName } = child.props;
                const childs = child.props.children;
                const onClick = child.props.cellOnClick ?
                  child.props.onCellClick : '';

                const cls = cellClassName || '';

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
