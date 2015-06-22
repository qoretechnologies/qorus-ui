define(function (require) {
  var React = require('react');

  var SearchFormView = React.createClass({
    propTypes: {
      filterChange: React.PropTypes.func.isRequired,
      filterText: React.PropTypes.string
    },

    getInitialProps: function () {
      return {
        filterText: ''
      }
    },

    filterChange: function (e) {
      this.props.filterChange({ text: e.target.value });
      e.preventDefault();
    },

    onSubmit: function (e) {
      e.preventDefault();
    },

    render: function () {
      return (
        <form className="form-search" onSubmit={ this.onSubmit }>
          <input type="text" className="search-query appendInputButton" placeholder="Search..." defaultValue={ this.props.filterText } onChange={this.filterChange} />
        </form>
      );
    }
  });

  return SearchFormView;
});
