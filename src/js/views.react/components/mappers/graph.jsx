define(function (require) {
  var React = require('react'),
      _     = require('underscore'),
      Graph;

  var InputTable = React.createClass({
    render: function () {
      var pos = 0,
          style = {
            fill: 'rgb(255,255,255)',
            'stroke-width': 1,
            stroke: 'rgb(0,0,0)'
          };

      var nodes = _.map(this.props.inputs, function (input) {
        pos = pos + 15;
        return <text key={ input.name } x={ this.props.x + 10 } y={ pos } fill="black">{ input.name }</text>;
      }, this);

      return (
        <g>
          <rect height={ this.props.height } width={ this.props.width } x={ this.props.x } y={ this.props.y } style={ style } />
          { nodes }
        </g>
      );
    }
  });

  var OutputTable = React.createClass({
    render: function () {
      var pos = 0,
          style = {
            fill: 'rgb(255,255,255)',
            'stroke-width': 1,
            stroke: 'rgb(0,0,0)'
          };

      var nodes = _.map(this.props.outputs, function (input) {
        pos = pos + 15;
        return <text key={ input.name } x={ this.props.x + 10 } y={ pos } fill="black">{ input.name }</text>;
      }, this);

      return (
        <g>
          <rect height={ this.props.height } width={ this.props.width } x={ this.props.x } y={ this.props.y } style={ style } />
          { nodes }
        </g>
      );
    }
  });

  Graph = React.createClass({
    propTypes: {
      mapper: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
      return {
        width: 200,
        height: 400
      };
    },

    componentDidMount: function () {
      var parent = this.getDOMNode().parentNode;

      this.setState({
        width: parent.offsetWidth,
        height: parent.offsetHeight
      });
    },

    render: function () {
      return (
        <svg width="100%" height="100%">
          <InputTable inputs={ this.getInputs() } width={ this.state.width/2 } height={ this.state.height } x={ 0 } y={ 0 } />
          <OutputTable outputs={ this.getOutputs() } width={ this.state.width/2 } height={ this.state.height } x={ this.state.width/2 } y={ 0 }/>
        </svg>
      );
    },

    getInputs: function () {
      if (this.props.mapper && this.props.mapper.opts) {
        var input = _.map(this.props.mapper.opts.input, function (val, key) {
          return { name: key, desc: val };
        });
        return input;
      }

      return null;
    },

    getOutputs: function () {
      if (this.props.mapper && this.props.mapper.opts) {
        var input = _.map(this.props.mapper.opts.output, function (val, key) {
          return _.extend({}, val, { name: key });
        });
        return input;
      }

      return null;
    }

  });

  return Graph;
});
