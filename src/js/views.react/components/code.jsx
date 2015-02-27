define(function (require) {
  var React      = require('react'),
      LoaderView = require('jsx!views.react/components/loader'),
      Prism      = require('prism');

  var CodeView = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState: function () {
      return {
        highlighted: false,
        code: this.props.code
      }
    },
  
    componentDidMount: function () {
      this.highlight();
    },
    
    componentDidUpdate: function () {
      this.highlight();
    },
    
    highlight: function () {
      if (this.props.code && !this.state.highlighted) {
        _.defer(function Highlight() {
            code = Prism.highlight(this.props.code, Prism.languages.qore);
            $(this.getDOMNode()).find('code').html(code);
            this.setState({ highlighted: true, code: code });        
          }.bind(this)
        )
      };
    },
    
    render: function () {
      var Code = <LoaderView />;
      
      if (this.state.code) {
        Code = <code className="language-qore" dangerouslySetInnerHTML={{__html: this.state.code }} />;
      }

      return (
        <pre className="language-qore">
          { Code }
        </pre>
      )
    }
  });
  
  return CodeView;
});