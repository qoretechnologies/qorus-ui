define(function (require) {
  var React      = require('react'),
      LoaderView = require('jsx!views.react/components/loader'),
      Prism      = require('prism');

  var Numbering = React.createClass({
    render: function () {
      var spans = [];
    
      if (this.props.lines > 0) {
        for (var i=0; i<this.props.lines; i++) {
          spans.push(<span key={i} />);
        }
      }
      
        
      return <div className="line-numbers-rows">{ spans }</div>;
    }
  });
  
  var CodeNumbered = React.createClass({
    getLinesSize: function () {
      if (!this.props._code) return 0;
      return this.props._code.replace(/\n+$/, '').split('\n').length;
    },
    
    render: function () {
      return (
        <code className={ this.props.className }><Numbering lines={ this.getLinesSize() } /><div dangerouslySetInnerHTML={{ __html: this.props.code }} /></code>
      );
    }
  });

  var CodeView = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState: function () {
      return {
        highlighted: false,
        code: this.props.code
      };
    },
  
    componentDidMount: function () {
      this.highlight();
    },
    
    componentDidUpdate: function () {
      this.highlight();
    },
    
    componentReceiveProps: function () {
      this.highlight();
    },
    
    highlight: function () {
      if (this.props.code && !this.state.highlighted) {
          _.defer(function Highlight() {
            if (this.isMounted() && this.props.code) {
              code = Prism.highlight(this.props.code, Prism.languages.qore);
/*              $(this.getDOMNode()).find('code').html(code);*/
              this.setState({ highlighted: true, code: code });
            }
          }.bind(this)
        );  
      }
    },
    
    render: function () {
      var Code = <LoaderView />;
        
      if (this.state.code) {
        Code = <CodeNumbered className="language-qore" code={ this.state.code } _code={ this.props.code } />;
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