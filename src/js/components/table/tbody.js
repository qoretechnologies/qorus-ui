import React, { Component, PropTypes } from 'react';
import Cell from './cell';
import Col from './col';


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
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func
  }

  static defaultProps = {
    onRowClick: () => {}
  }

  constructor(props) {
    super(props);

    this.rows = [];
  }

  getCellChildren(col) {
    return React.Children.count(col.props.children) ?
      React.Children.toArray(col.props.children) :
      [];
  }

  onRowClick(e) {
    this.props.onRowClick(
      this.props.data[this.rows.indexOf(e.currentTarget)],
      this.rows.indexOf(e.currentTarget)
    );
  }

  render() {
    return (
      <tbody>
        {this.props.data.map((rec, recIdx) => (
          <tr
            key={recIdx}
            onClick={this.onRowClick.bind(this)}
            ref={row => this.rows[recIdx] = row}
          >
            {React.Children.map(this.props.children, (col, colIdx) => (
              <Cell
                comp={col.props.comp}
                props={col.props.props(rec, recIdx, colIdx)}
                childProps={col.props.childProps(rec, recIdx, colIdx)}
              >
                {React.Children.map(this.getCellChildren(col), c => c)}
              </Cell>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}
