define(function (require, module, exports) {
  var _      = require('underscore'),
      React  = require('react'),
      Loader = require('jsx!views.react/components/loader'),
      FETCH  = require('cjs!constants/fetch');

  var RestComponent = React.createClass({
    getDefaultProps: function () {
      return {
        onFailMessage: "Failed to fetch resource via REST API",
        onEmptyMessage: "No data found",
        size: 0
      };
    },

    render: function () {
      var children = <Loader />, retry = null, props = this.props;

      if (props.fetchStatus === FETCH.DONE) {
        if (props.size === 0) {
          children = <p>{ props.onEmptyMessage }</p>;
        } else {
          children = props.children;  
        }
      } else if (props.fetchStatus === FETCH.ERROR) {
        if (props.retry) {
          retry = <p><button className="btn btn-small btn-success" onClick={ props.retry }><i className="icon-refresh" /> Retry</button></p>;
        }

        children = (
          <div className="alert alert-warning">
            <h4>{ props.onFailMessage }</h4>
            <p>{ props.fetchError }</p>
            { retry }
          </div>
        );
      }

      return (
        <div>
          { children }
        </div>
      );
    }
  });

  module.exports = RestComponent;

  return RestComponent;
});
