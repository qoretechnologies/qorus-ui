define(function (require, exports, module) {
  var React = require('react'),
      SystemSettings = require('models/settings'),
      $ = require('jquery'),
      defaultWidth = 400,
      PaneView;

  require('jquery-ui');

  PaneView = React.createClass({
    getStorageKey: function () {
      var cvkey = this.props.name || 'pane';
      return [module.id.replace(/\//g, '.'), cvkey].join('.');
    },

    componentDidMount: function () {
      var $el = this._resizable = $(this.refs.pageSlide.getDOMNode());
      var key = this.getStorageKey();

      $el.resizable({
        handles: 'w',
        minWidth: 400,
        resize: function (event, ui) {
          // fix the element left position
          ui.element
            .css('left', '');
        },
        stop: function (event, ui) {
          SystemSettings.set(key, ui.size.width);
          SystemSettings.save();
        }
      });
    },

    componentWillUnmount: function () {
      if (this._resizable) {
        this._resizable.resizable('destroy');
      }
    },

    render: function () {
      var props = _.omit(this.props, ['contentView', 'children']);
      var style = {
        width: SystemSettings.get(this.getStorageKey()) || defaultWidth
      };

      if (this.props.contentView) {
        children = <this.props.contentView {...props} />;
      } else {
        children = this.props.children;
      }

      return <div className="pageslide left show" ref="pageSlide" style={style}>
                <a href="#" className="btn btn-small btn-inverse close-view" onClick={this.props.onClose}><i className="icon-remove-sign"></i> Close</a>
                <div className="content">
                  { children }
                </div>
              </div>
      ;
    }
  });

  return PaneView;
});
