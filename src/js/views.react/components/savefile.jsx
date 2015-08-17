define(function (require, module, exports) {
  require('sprintf');

  var React      = require('react'),
      PropTypes  = React.PropTypes,
      _          = require('underscore'),
      utils      = require('utils'),
      classNames = require('classnames'),
      $          = require('jquery');

  var SaveToFile = React.createClass({
    propTypes: {
      getDump: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired,
      model: PropTypes.object.isRequired,
      mimeType: PropTypes.string,
      buttonText: PropTypes.string,
      icon: PropTypes.string,
      className: PropTypes.string
    },

    getDefaultProps: function () {
      return {
        mimeType: 'text/plain',
        buttonText: 'Dump to File',
        icon: 'icon-download'
      };
    },

    getInitialState: function () {
      return {
        download: false
      };
    },

    componentDidUpdate: function () {
      if (this.state.download && this.refs.download) {
        var node = React.findDOMNode(this.refs.download);
        node.click();
        this.setState({ download: false });
      }
    },

    onClick: function (e) {
      var model  = this.props.model,
          def    = _.result(model, this.props.getDump),
          name   = model.get('name'),
          target = e.target;

      e.preventDefault();
      e.stopPropagation();

      // ensure deferred object
      def = $.when(def).then();

      def.done(function (resp) {
        this.setState({
          download: true,
          filename: name + '.qvset',
          data: resp[name]
        });
      }.bind(this));
    },

    render: function () {
      var download = null,
          cls = classNames("btn btn-success btn-mini", this.props.className);

      if (this.state.download) {
        download = <a ref="download" onClick={ function (e) { e.stopPropagation(); } }  download={ this.state.filename }
                    href={sprintf('data:%s;base64,%s', this.props.mimeType, utils.utf8ToB64(this.state.data.trim()))} />;
      }

      return (
        <div>
          <a className={ cls } onClick={ this.onClick }><i className={ this.props.icon } /> { this.props.buttonText }</a>
          { download }
        </div>
      );
    }
  });


  module.exports = SaveToFile;

  return SaveToFile;
});
