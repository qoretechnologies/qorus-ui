define(function (require) {
  var React      = require('react'),
      Backbone   = require('backbone'),
      classNames = require('classnames');

  require('react.backbone');

  return React.createBackboneClass({
    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    incAutostart: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.props.model.doAction('incAutostart');
    },

    decAutostart: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.props.model.doAction('decAutostart');
    },

    setAutostart: function (e) {
      this.props.model.setAutostart(value);
    },

    render: function () {
      var model = this.props.model;
      var cx = classNames;
      var classes = cx({
        'label': true,
        'autostart-change': true,
        'label-success': (model.get('autostart') == model.get('exec_count') && model.get('autostart') > 0),
      });

      return (
        <div className="autostart btn-controls">
          <a className="label" onClick={this.decAutostart}><i className="icon-minus"></i></a>
          <a className={ classes } title="Click to edit" data-toggle="tooltip">{ model.get('autostart') }</a>
          <a className="label" onClick={this.incAutostart}><i className="icon-plus"></i></a>
        </div>
      );
    }
  });
});
