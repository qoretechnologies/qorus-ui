define(function (require) {
  var $              = require('jquery'),
      React          = require('react'),
      LoaderView     = require('jsx!views.react/components/loader'),
      Prism          = require('prism'),
      PrismComponent = require('jsx!views.react/components/prism');
      
  PrismComponent._.languages = Prism.languages;

  var CodeView = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function () {
      var props = {};
      var Code = <LoaderView />;
      
      if (this.props.offset) {
        props.style = {
          'counter-increment': 'linenumber +' + this.props.offset
        };
      }
        
      if (this.props.code) {
        Code = <PrismComponent language="qore">{ this.props.code }</PrismComponent>;
      }
      
      return (
        <pre className="language-qore line-numbers" {...props}>
          { Code }
        </pre>
      );
    }
  });
  
  return CodeView;
});