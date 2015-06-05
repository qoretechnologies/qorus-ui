define(function (require, exports, module) {
  var React     = require('react'),
      Reflux    = require('reflux'),
      _         = require('underscore'),
      $         = require('jquery'),
      Actions   = require('views.react/actions/modal'),
      utils     = require('utils'),
      ModalView, HeaderView, FooterView, BackdropView;

  var FadeMixin = {
    _fadeIn: function (els) {
      _.each(els, function (el) {
        el.className += ' in';
      });
    },

    _fadeOut: function (els) {
      _.each(els, function (el) {
        el.className = _.without(el.className.split(' '), 'in').join(' ');
      });
    },

    componentDidMount: function () {
      var els = this.getDOMNode().querySelectorAll('.fade');

      if (!this.state.hide) {
        _.delay(this._fadeIn.bind(null, els), 100);
      } else {
        _.delay(this._fadeOut.bind(null, els), 100);
      }
    }

  };

  var ResizableMixin = {
    componentWillUnmount: function () {
      if (this.props.resizable) {
        var $el = this.getElement();
        var key = 'resize.' + this.key;

        $el.off();
        $(window).off(key);
      }
    },

    componentWillMount: function () {
      this.key = utils.guid();
    },

    componentDidMount: function () {
      if (this.props.resizable) {
        var $el  = this.getElement(),
            self = this,
            key  = 'resize.' + this.key;

        if ($el) {
          // fix size on resize event

          $el.on("resize.modal", function(event, ui) {
              ui.element.css("margin-left", -ui.size.width/2);
              ui.element.css("left", "50%");
              self.fixHeight();
          });

          this._createResizable();

          $el.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", this.fixHeight);

          $(window).on(key, $.proxy(this.fixHeight, this));
        }
      }
    },

    getElement: function () {
      if (this.isMounted()) {
        return $(this.getDOMNode()).find('.modal');
      }
      return false;
    },

    _createResizable: function () {
      var $el           = this.getElement(),
          windowHeight  = $(window).innerHeight(),
          windowWidth   = $(window).innerWidth(),
          margin        = this.margin ? _.result(this, 'margin') : $el.position().top * 2,
          max_height    = windowHeight - margin,
          max_width     = windowWidth - margin;

      this.fixHeight();

      // enable resizable
      $el.resizable({
        handles: "se",
        minHeight: $el.height(),
        maxHeight: max_height,
        minWidth: $el.width(),
        maxWidth: max_width
      });
    },

    fixHeight: function (e) {
      var $el           = this.getElement(),
          windowHeight  = $(window).innerHeight(),
          windowWidth   = $(window).innerWidth(),
          margin        = this.margin ? _.result(this, 'margin') : $el.position().top * 2,
          max_height    = windowHeight - margin;

      $el.css('padding-bottom', $el.find('.modal-footer').outerHeight() + 10).css('maxHeight', max_height);
      if (!e || !e.target.tagName) {
        var padding = 15;

        var $body = $el.find('.modal-body');
        var cor = $body.innerHeight() - $body.height();
        var h = max_height - $el.find('.modal-header').outerHeight() - cor - padding;

        if ($el.find('.modal-footer')) {
          h -= $el.find('.modal-footer').outerHeight() - padding;
        }

        $body.height(h).css('maxHeight', h);
      }
    }
  };

  var Store = function Store() {
    return Reflux.createStore({
      listenables: [Actions],
      init: function () {
        this.state = {
          hide: false
        };
      },
      onHide: function () {
        this.setState({ hide: true });
      },
      onShow: function () {
        this.setState({ hide: false });
      },
      setState: function (state) {
        this.state = _.extend(this.state, state);
        this.trigger(this.state);
      }
    });

  };

  HeaderView = React.createClass({
   close: function (e) {
      Actions.hide();
    },

    render: function () {
      return (
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={ this.close }>&times;</button>
          <h3>{ this.props.title }</h3>
        </div>
      );
    }
  });

  FooterView = React.createClass({
    close: function () {
      Actions.hide();
    },

    render: function () {
      return (
        <div className="modal-footer">
          <a href="#" className="btn" onClick={ this.close }>Close</a>
        </div>
      );
    }
  });

  BackdropView = React.createClass({
    close: function () {
      Actions.hide();
    },

    render: function () {
      var style = { display: this.props.hide ? '' : 'block' };

      return (
        <div className={ React.addons.classSet({ 'modal-backdrop': true, fade: true, hide: true }) } style={ style } onClick={ this.close }>
          { this.props.children }
        </div>
      );
    }
  });


  ModalView = React.createClass({
    mixins: [Reflux.ListenerMixin, FadeMixin, ResizableMixin],

    margin: function () {
      var windowHeight = $(window).innerHeight();

      return Math.ceil(windowHeight*0.1) * 2;
    },

    getDefaultProps: function () {
      return {
        footer: false,
        wider: true,
        resizable: true
      };
    },

    componentDidMount: function () {
      var store = new Store();
      this.listenTo(store, this.onStoreUpdate);
    },

    onStoreUpdate: function (state) {
      if (state.hide) {
        this._removeModal();
      }
    },

    _removeModal: function () {
      var parent = this.getDOMNode().parentNode;
      this._fadeOut(this.getDOMNode().querySelectorAll('.fade'));
      _.delay(function () {
        React.unmountComponentAtNode(parent);
        parent.parentNode.removeChild(parent);
      }, 500);
    },

    getInitialState: function () {
      return {
        hide: false
      };
    },

    close: function () {
      Actions.hide();
    },

    show: function () {
      Actions.show();
    },

    render: function () {
      var body = this.props.contentView;
      var header = this.props.title ? <HeaderView title={ this.props.title }/> : '';
      var footer = this.props.footer ? <FooterView close={ this.props.close }/> : '';

      return (
        <div>
          <BackdropView hide={ this.state.hide } />
          <div className={ React.addons.classSet({ modal: true, fade: true, wider: this.props.wider }) }>
            { header }
            { this.props.children }
            { footer }
          </div>
        </div>
      );
    }
  });

  module.exports = ModalView;

  return {
    ModalView: ModalView,
    HeaderView: HeaderView,
    FooterView: FooterView
  };
});
