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
    onRowClick: PropTypes.func,
  };


  static defaultProps = {
    shouldHighlight: () => false,
    onRowClick: () => undefined,
  };


  /**
   * Initializes internal state.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this._rows = null;
  }


  /**
   * Sets up references for table row elements.
   */
  componentWillMount() {
    this._rows = [];
  }


  /**
   * Sets up references for table row elements.
   */
  componentWillReceiveProps() {
    this._rows = [];
  }


  /**
   * Cleans up internal state.
   */
  componentWillUnmount() {
    this._rows = null;
  }


  /**
   * Calls `onRowClick` prop callback with row data record and index.
   *
   * If given event has been previously prevented, nothing happens.
   *
   * @param {Event} ev
   */
  onRowClick(ev) {
    if (ev.defaultPrevented) return;

    this.props.onRowClick(
      this.props.data[this._rows.indexOf(ev.currentTarget)],
      this._rows.indexOf(ev.currentTarget)
    );
  }


  /**
   * Returns one cell element with column value in row record.
   *
   * @param {ReactElement} col
   * @param {number} colIdx
   * @param {Object} rec
   * @param {number} recIdx
   * @return {ReactElement}
   */
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


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <tbody>
        {this.props.data.map((rec, recIdx) => {
          const refRow = c => this._rows && (this._rows[recIdx] = c);

          return (
            <tr
              key={recIdx}
              className={classNames({
                info: this.props.shouldHighlight(rec, recIdx),
              })}
              onClick={::this.onRowClick}
              ref={refRow}
            >
              {React.Children.map(this.props.children, (col, colIdx) => (
                this.renderCell(col, colIdx, rec, recIdx)
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  }
}
