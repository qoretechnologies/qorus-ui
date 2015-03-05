define(function (require) {
  var React = require('react'), 
      views = {},
      _     = require('underscore');
  
  require('react.backbone');
  
  views.ControlView = React.createClass({
    propTypes: {
      control: React.PropTypes.object.isRequired
    },
    
    onClick: function (e) {
      e.stopPropagation();
      e.preventDefault();

      this.props.model.doAction(this.props.control.action);
    },
  
    render: function () {      
      var control  = this.props.control,
          cls      = "label label-" + control.css,
          icon_cls = "icon-" + control.icon;
      
      return (
        <a className={cls} title={control.title} onClick={this.onClick}><i className={icon_cls} /></a>
      );
    }
  });
  
  views.ControlsView = React.createBackboneClass({
    propTypes: {
      // expects Element factory
      controlView: React.PropTypes.func
    },
  
    render: function () {
      var key   = this.props.model.get('id'),
          model = this.props.model,
          CView = this.props.controlView || views.ControlView,
          props = _.omit(this.props, ['controlView', 'children']);

      var controls = _.map(_.result(this.props.model, 'getControls'), function (control) {
        return <CView {...props} control={control} key={control.title} model={ model } />;
      });
            
      return (
        <div className="btn-controls">{ controls }</div>
      );
    }
  });

  return views;
});