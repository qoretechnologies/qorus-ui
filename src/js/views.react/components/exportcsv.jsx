define(function (require) {
  var React   = require('react'),
      _       = require('underscore'),
      utils   = require('utils'),
      helpers = require('qorus/helpers'),
      Export;

  Export = React.createClass({
    propTypes: {
      opts: React.PropTypes.object.isRequired
    },

    exportCSV: function (e) {
      var opts  = _.extend({}, this.props.opts),
          csv   = utils.dataToCSV(opts),
          el    = this.getDOMNode();

      if (this.props.opts.export) {
        el.href = csv;
      }
    },

    render: function () {
      var filename = helpers.slugify(this.props.filename) + '.csv';

      return <a download={ filename } onClick={ this.exportCSV }><i className="icon-copy"></i> Export CSV</a>;
    }
  });

  return Export;
});
