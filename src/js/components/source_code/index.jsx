import React, { Component, PropTypes } from 'react';

import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-qore';
import 'prismjs/plugins/line-numbers/prism-line-numbers';


import classNames from 'classnames';
import { pureRender } from '../utils';


/**
 * Source code uses Prism to format text.
 *
 * The source code is passed as a child. It is expected to be in Qore
 * language.
 *
 * This component uses custom line number plugin which is supports
 * wrapped lines. Line wrap can be toggled which is managed by
 * internal state. The plugin also supports line number offset.
 */
@pureRender
export default class SourceCode extends Component {
  static propTypes = {
    lineOffset: PropTypes.number,
    children: PropTypes.string,
    height: PropTypes.number,
  };

  static defaultProps = {
    lineOffset: 0,
  };

  state = {
    wrapLines: false,
  };

  componentDidMount() {
    Prism.highlightElement(this.code);
  }

  componentDidUpdate() {
    Prism.highlightElement(this.code);
  }

  /**
   * Changes wrap-line state.
   */
  toggleWrapLines = () => {
    this.setState({ wrapLines: !this.state.wrapLines });
  };

  bindCodeRef = code => {
    this.code = code;
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className="source-code">
        <button
          type="button"
          className={classNames({
            btn: true,
            'btn-xs': true,
            'btn-default': !this.state.wrapLines,
            'btn-success': this.state.wrapLines,
            'source-code__wrap-toggle': true,
          })}
          onClick={this.toggleWrapLines}
          title={this.state.wrapLines ?
                 'Disable line wrap' :
                 'Wrap lines'}
        >
          <i className="fa fa-outdent"></i>
        </button>
        <pre
          className={classNames({
            'line-numbers': !this.state.wrapLines,
            'source-code__code': true,
            'source-code__code--wrap': this.state.wrapLines,
            'language-qore': true,
          })}
          style={{
            maxHeight: this.props.height || 'auto',
          }}
        >
          <code
            className="language-qore"
            ref={this.bindCodeRef}
          >
            {this.props.children}
          </code>
        </pre>
      </div>
    );
  }
}
