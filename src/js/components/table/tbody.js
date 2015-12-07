import React, { Component, PropTypes } from 'react';
import Cell from './cell';


import classNames from 'classnames';
import { pureRender } from '../utils';


/**
 * Table body section (tbody) component.
 *
 * It expects data prop as an array of records (a record can be
 * anything). It renders a table row (td element) for each record and
 * a data cell (Cell element) for Col passed as a child to TBody.
 *
 * Optionally, onRowClick event handler can be attached to each
 * row. It will receive data record and its index as parameters.
 */
@pureRender
export default class TBody extends Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    data: PropTypes.array.isRequired,
    highlight: PropTypes.array,
    onRowClick: PropTypes.func
  }

  static defaultProps = {
    highlight: [],
    onRowClick: () => {}
  }

  constructor(props) {
    super(props);

    this.rows = [];
  }

  onRowClick(e) {
    this.props.onRowClick(
      this.props.data[this.rows.indexOf(e.currentTarget)],
      this.rows.indexOf(e.currentTarget),
      e
    );
  }

  getCellChildren(col) {
    return React.Children.count(col.props.children) ?
      React.Children.toArray(col.props.children) :
      [];
  }

  render() {
    return (
      <tbody>
        {this.props.data.map((rec, recIdx) => (
          <tr
            key={recIdx}
            className={classNames({
              info: this.props.highlight.indexOf(recIdx) >= 0
            })}
            onClick={this.onRowClick.bind(this)}
            ref={row => this.rows[recIdx] = row}
          >
            {React.Children.map(this.props.children, (col, colIdx) => {
              if (!col) return col;

              return (
                <Cell
                  comp={col.props.comp}
                  field={col.props.field}
                  props={col.props.props(rec, recIdx, colIdx)}
                  childProps={col.props.childProps(rec, recIdx, colIdx)}
                >
                  {React.Children.map(this.getCellChildren(col), c => c)}
                </Cell>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  }
}
