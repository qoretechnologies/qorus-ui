define(function (require) {
  var React = require('react'),
      _     = require('underscore'),
      Graph;

  var Marker = React.createClass({
    componentDidMount: function () {
      var el = this.getDOMNode();

      el.setAttribute('refX', 10);
      el.setAttribute('refY', 10);
      el.setAttribute('markerUnits', 'strokeWidth');
      el.setAttribute('markerWidth', 10);
      el.setAttribute('markerHeight', 10);
      el.setAttribute('orient', 'auto');
    },

    render: function () {
      return (
        <marker id="Triangle"
          viewBox="0 0 20 20"
          orient="auto">
          <path d="M 0 0 L 20 10 L 0 20 z"/>
        </marker>
      );
    }
  });

  var BoxTable = React.createClass({
    _boxes: [],

    addBox: function (box) {
      this._boxes.push(box);
    },

    getBoxes: function () {
      return this._boxes;
    },

    getBox: function (id) {
      return _.find(this._boxes, { key: id });
    },

    resetBoxes: function () {
      this._boxes = [];
    },

    render: function () {
      var pos = 15,
          title = this.props.title,
          style = _.extend({}, {
            strokeWidth: 1,
            stroke: '#000',
            fill: '#fff'
          });

      this.resetBoxes();

      var nodes = _.map(this.props.inputs, function (input) {
        pos += 15;

        var box = {
          key: input.name,
          x: this.props.x + 10,
          y: pos,
          width: Math.min(this.props.maxWidth, 200),
          height: 15,
          value: input.value
        }

        this.addBox(box);

        return <BoxCell {...box} ref={ input.name } key={ input.name } title={ input.name } textClassName="box-title" />;
      }, this);

      return (
        <g>
          <rect height={Math.max(pos + 10, 100) } width={ Math.min(this.props.maxWidth, 200) } x={ this.props.x } y={ this.props.y } style={ style } />
          <BoxCell x={ this.props.x + 10 } y={ this.props.y + 15 } width={ Math.min(this.props.maxWidth, 200) } title={ this.props.title } textClassName="box-title"/>
          { nodes }
        </g>
      );
    }
  });

  var BoxCell = React.createClass({
    render: function () {
      var props = this.props;

      return (
        <g>
          <text x={ props.x } y={ props.y } fill="black" className={ props.textClassName }>{ props.title }</text>
          <line x1={ props.x - 10 } x2={ props.x + props.width - 10 } y1={ props.y + 2 } y2={ props.y + 2 } stroke="black" strokeWidth="1"/>
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
        height: 400,
        lines: []
      };
    },

    componentDidMount: function () {
      var parent = this.getDOMNode().parentNode;

      this.setState({
        width: parent.offsetWidth,
        height: parent.offsetHeight,
        lines: this.getLines()
      });
    },

    render: function () {
      var lines = this.state.lines;

      return (
        <svg width="100%" height="100%" viewBox={ [0,0,1000,1000].join(' ') }>
          <defs>
          <Marker />
          </defs>
          <BoxTable
            ref="input"
            inputs={ this.getInputs() }
            maxWidth={ 1000/2 - 50 }
            x={ 0 }
            y={ 0 }
            style={{ fill: '#fff' }}
            title="Datasource" />
          <BoxTable
            ref="output"
            inputs={ this.getOutputs() }
            maxWidth={ 1000/2 - 50 }
            x={ 1000/2 } y={ 0 }
            style={{ fill: '#fff' }}
            title="Output" />
          { lines }
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
    },

    getLines: function () {
      var lines = [];

      if (this.props.mapper && this.props.mapper.opts) {
        var pointsLeft = [],
            pointsRight = [];

        _.each(this.props.mapper.field_source, function (fs) {
          var key = fs.key,
              type = fs.type,
              value = fs.value;

          if (type === 'name') {
            type = 'input';
            var p = this.refs[type].getBox(value);
            var p2 = this.refs['output'].getBox(key);

            var x1 = p.width + p.x - 10,
                x2 = p2.x - 10,
                y1 = p.y - 5,
                y2 = p2.y - 5;

            var l = <path d={ sprintf("M %s %s L %s %s", x1, y1, x2, y2) } fill="none" stroke="black" strokeWidth="1" markerEnd="url(#Triangle)"/>;

            lines.push(l);

          }
        }, this);

      }
      return lines;
    }

  });

  return Graph;
});
