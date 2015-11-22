import React, { Component, PropTypes } from 'react';
import Cell from './cell';
import Col from './col';


import classNames from 'classnames';
import { pureRender } from '../utils';


/**
 * Table body section (tbody) component.
 *
 * It expects data prop with array of objects. If no Col element is
 * passed as a child, it just iterates over each data element's
 * property and renders every value of every property. It expects data
 * records as [[key, value], ...] pairs similar to Map build-in
 * object.
 *
 * If there are Col children, it passes to Cell props as de returned
 * by Col#props.props function and comp as is on Col#props.comp.
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
    this.cols = this.findOrCreateCols(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.cols = this.findOrCreateCols(nextProps);
  }

  findOrCreateCols(props) {
    return React.Children.count(props.children) ?
      React.Children.toArray(props.children) :
      Object.keys(props.data[0]).map(() => <Col />);
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
    this.cols 

    return (
      <tbody>
        {this.props.data.map((rec, recIdx) => (
          <tr
            key={recIdx}
            onClick={this.onRowClick.bind(this)}
            ref={row => this.rows[recIdx] = row}
          >
            {this.cols.map((col, colIdx) => (
              <Cell
                key={colIdx}
                comp={col.props.comp}
                props={col.props.props(rec, recIdx, colIdx)}
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
