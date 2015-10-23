import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

require('jquery-ui/resizable');


export class PaneView extends Component {
  static propTypes = {
    contentView: PropTypes.node,
    children: PropTypes.node,
    onClose: PropTypes.func,
    width: PropTypes.number
  }
  // getStorageKey() {
  //   var cvkey = this.props.name || 'pane';
  //   return [module.id.replace(/\//g, '.'), cvkey].join('.');
  // }
  //
  componentDidMount() {
    const $el = this._resizable = $(this.refs.pageSlide.getDOMNode());
    // var key = this.getStorageKey();

    $el.resizable({
      handles: 'w',
      minWidth: 400,
      resize: function (event, ui) {
        // fix the element left position
        ui.element
          .css('left', '');
      // },
      // stop: function (event, ui) {
      //   SystemSettings.set(key, ui.size.width);
      //   SystemSettings.save();
      }
    });
  }

  componentWillUnmount() {
    if (this._resizable) {
      this._resizable.resizable('destroy');
    }
  }

  render() {
    const { contentView, onClose, width } = this.props;
    let { children } = this.props;
    const props = _.omit(this.props, ['contentView', 'children']);
    const style = { width: width };

    if (contentView) {
      children = <contentView {...props} />;
    }

    return (
      <div className='pageslide left show' ref='pageSlide' style={style}>
        <a className='btn btn-xs btn-inverse close-view'
          onClick={ onClose }>
          <i className='fa fa-times-circle'></i> Close
        </a>
        <div className='content'>
          { children }
        </div>
      </div>
    );
  }
}
