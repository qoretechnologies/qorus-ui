define(function (require) {
  var React = require('react'),
      _     = require('underscore');

  var LogRow = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    
    render: function () {
      return (
        <pre>{ this.props.text || this.props.children }</pre>
      )
    }
  });

  var LogView = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function () {
      return {
        rows: []
      }
    },
    
    getInitialState: function () {
      return {
        scroll: true
      }
    },
    
    propTypes: {
      rows: React.PropTypes.array.isRequired
    },
    
    componentDidMount: function () {
      _.defer(this.scroll);
    },
    
    componentDidUpdate: function () {
      _.defer(this.scroll);
    },

    scroll: function () {
      if (this.props.scroll) {
        var $el = $(this.getDOMNode());

        $el.scrollTop(function () {
          return this.scrollHeight;
        });
      }
    },

    render: function () {
      var rows = <LogRow>Empty log</LogRow>;
      
      if (this.props.rows.length > 0) {
        rows = this.props.rows.map(function (row, idx) {
          return <LogRow key={ idx }>{ row }</LogRow>;
        });
      }    
    
      return (
        <div className="log log-area span12" onScroll={ this.stopAutoscroll }>
          { rows }
        </div>
      )  
    },
    
    stopAutoscroll: function () {
      if (this.getDOMNode().scrollHeight - this.getDOMNode().offsetHeight != this.getDOMNode().scrollTop && this.props.scroll) {
        this.props.actions.toggleScroll();
      }
    }
    
  });
  
  return LogView;
});