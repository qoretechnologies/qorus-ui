define(function (require) {
  var $              = require('jquery'),
      React          = require('react'),
      LoaderView     = require('jsx!views.react/components/loader'),
      Prism          = require('prism'),
      PrismComponent = require('jsx!views.react/components/prism');
      
  PrismComponent._.languages = Prism.languages;

  var CodeView = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    
    componentDidMount: function () {
      var $el = $(this.getDOMNode()).find('div[class*="language-"]');
      var html = $el.html();
      if (html) {
        var lines = html.split('\n');
        var lines_html = [];

        for (var i=0;i<=lines.length;i++) {
          lines_html.push("<span class='line'>" + lines[i] + "</span>");
        }

        $el.html(lines_html.join('\n'));      
      }
    },

    render: function () {
      var Code = <LoaderView />;
        
      if (this.props.code) {
        Code = <PrismComponent language="qore">{ this.props.code }</PrismComponent>;
      }

      return (
        <pre className="language-qore line-numbers">
          { Code }
        </pre>
      );
    }
  });
  
  return CodeView;
});