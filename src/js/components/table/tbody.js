import React, { Component, PropTypes } from 'react';
import Cell from './cell';


import classNames from 'classnames';
import { pureRenderOmit } from '../utils';


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
@pureRenderOmit('children')
export default class TBody extends Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    data: PropTypes.array.isRequired,
    identifier: PropTypes.func,
    shouldHighlight: PropTypes.func,
    onRowClick: PropTypes.func
  }

  static defaultProps = {
    shouldHighlight: () => false,
    onRowClick: () => {}
  }

  constructor(props) {
    super(props);

    this._rows = [];
    this._cellCache = new Map();
  }

  onRowClick(ev) {
    if (ev.defaultPrevented) return;

    this.props.onRowClick(
      this.props.data[this._rows.indexOf(ev.currentTarget)],
      this._rows.indexOf(ev.currentTarget)
    );
  }

  getCellKey(col, colIdx, rec, recIdx) {
    if (!this.props.identifier) return null;

    const recId = this.props.identifier(rec, recIdx);

    return `${colIdx}.${recId}`;
  }

  renderCell(col, colIdx, rec, recIdx) {
    return (
      <Cell
        comp={col.props.comp}
        field={col.props.field}
        props={col.props.props(rec, recIdx, colIdx)}
        childProps={col.props.childProps(rec, recIdx, colIdx)}
      >
        {React.Children.map(col.props.children, c => c)}
      </Cell>
    );
  }

  render() {
    return (
      <tbody>
        {this.props.data.map((rec, recIdx) => (
          <tr
            key={recIdx}
            className={classNames({
              info: this.props.shouldHighlight(rec, recIdx)
            })}
            onClick={this.onRowClick.bind(this)}
            ref={row => this._rows[recIdx] = row}
          >
            {React.Children.map(this.props.children, (col, colIdx) => (
              this.renderCell(col, colIdx, rec, recIdx)
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}
