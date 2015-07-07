define(function (require) {
  var React      = require('react'),
      classNames = require('classnames');

  return React.createClass({
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
      url: React.PropTypes.string,
      val: React.PropTypes.number
    },

    getInitialState: function () {
      return {
        val: this.props.val
      };
    },

    render: function () {
      var content;
      var cls = { badge: (this.props.val > 0) };
      var label = "badge-" + this.props.label;
      var cx = classNames;
      cls[label] = (this.props.val > 0);

      if (this.props.url) {
        content = <a href={this.props.url}><span className={cx(cls)}>{ this.props.val }</span></a>;
      } else {
        content = <span className={cx(cls)}>{ this.props.val }</span>;
      }

      return (
        content
      );
    }
  });
});
