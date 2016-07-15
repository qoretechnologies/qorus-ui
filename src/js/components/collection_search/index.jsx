/* @flow */
import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';
import { pureRender } from '../utils';

/**
 * Form suited for entry of collection filter criteria.
 *
 * It focuses only on criteria entry and producing the regular
 * expression which can be applied on data elsewhere.
 */
@pureRender
export default class CollectionSearch extends Component {
  static defaultProps = {
    regexp: false,
    ignoreCase: false,
    onChange: () => undefined,
  };

  props: {
    children: Array<React.Element<any>>,
    regexp: boolean,
    ignoreCase: boolean,
    onChange: () => void,
  };

  state = {
    filter: new RegExp('', this.getFlags()),
    source: '',
    isRegExp: false,
    error: null,
  };

  /**
   * Prevents search form from being submitted.
   *
   * @param {Event} ev
   */
  onSubmit: Function = (ev: Object): void => {
    ev.preventDefault();
  };


  /**
   * Changes filter based on new input as a source.
   *
   * The filter is changed and onChange prop callback is called with
   * filter as a parameter.
   *
   * @param {Event} ev
   */
  onSourceChange: Function = (ev: Object): void => {
    const source: string = ev.currentTarget.value;
    const [filter, error] = this.filterFromSource(
      this.state.isRegExp, source
    );

    this.setState({ source, filter, error });

    this.props.onChange(filter);
  };


  /**
   * Toggles indicator of filter source being treated as RegExp.
   *
   * The filter is changed and onChange prop callback is called with
   * filter as a parameter.
   */
  onRegExpToggle: Function = (): void => {
    const isRegExp: boolean = !this.state.isRegExp;
    const [filter, error] = this.filterFromSource(
      isRegExp, this.state.source
    );

    this.setState({ isRegExp, filter, error });

    this.props.onChange(filter);
  };


  /**
   * Flags for RegExp constructor based on props.
   *
   */
  getFlags() {
    return this.props.ignoreCase ? 'gi' : 'g';
  }


  /**
   * Creates a new filter.
   *
   * The first element of returned array is always a RegExp instance.
   *
   * If `isRegExp` is true and `rawSource` is not a valid RegExp
   * source, it returns Error as the second element. Otherwise, the
   * second element of returned array is `null`.
   *
   */
  filterFromSource(isRegExp: boolean, rawSource: string): Array<any> {
    let source: string;
    if (isRegExp) {
      source = rawSource;
    } else {
      source = rawSource.
        replace(/\\/g, '\\\\').
        replace(/\./g, '\\.').
        replace(/\*/g, '\\*').
        replace(/\+/g, '\\+').
        replace(/\?/g, '\\?').
        replace(/\[/g, '\\[').
        replace(/\]/g, '\\]').
        replace(/\(/g, '\\(').
        replace(/\)/g, '\\)').
        replace(/\{/g, '\\{').
        replace(/\}/g, '\\}').
        replace(/\|/g, '\\|').
        replace(/^\^/g, '\\^').
        replace(/\$$/g, '\\$');
    }

    let filter: ?RegExp;
    let error: ?string = null;
    while (!filter && source) {
      try {
        filter = new RegExp(source, this.getFlags());
      } catch (e) {
        if (!error) error = e;

        source = source.substring(0, source.length - 1);
      }
    }

    if (!filter) filter = new RegExp('', this.getFlags());

    return [filter, error];
  }

  render(): React.Element<any> {
    return (
      <form
        className="form-inline text-right form-search"
        onSubmit={this.onSubmit}
      >
        <div
          className={classNames({
            'form-group': true,
            'has-error': this.state.error,
          })}
        >
          {this.props.regexp && (
            <label
              className={classNames({
                btn: true,
                'btn-xs': true,
                'btn-default': !this.state.isRegExp,
                'btn-success': this.state.isRegExp,
                'form-search__mod': true,
              })}
            >
              RE
              <input
                type="checkbox"
                className="sr-only"
                checked={this.state.isRegExp}
                onChange={this.onRegExpToggle}
              />
            </label>
          )}
          <input
            type="search"
            className="form-control form-search__field"
            placeholder="Search…"
            value={this.state.source}
            onChange={this.onSourceChange}
          />
          <button
            type="submit"
            className="btn btn-default btn-xs form-search__btn"
          >
            <i className="fa fa-search" />
          </button>
        </div>
        {React.Children.count(this.props.children) > 0 && ' '}
        {React.Children.count(this.props.children) > 0 && (
          <div className="form-group">
            {this.props.children}
          </div>
        )}
      </form>
    );
  }
}

CollectionSearch.propTypes = {
  children: PropTypes.node,
  regexp: PropTypes.bool,
  ignoreCase: PropTypes.bool,
  onChange: PropTypes.func,
};
