define(function (require) {
  var React           = require('react'),
      _               = require('underscore'),
      Marker          = require('jsx!views.react/components/svg').Marker,
      slugify         = require('qorus/helpers').slugify,
      Reflux          = require('reflux'),
      StoreStateMixin = require('views.react/stores/mixins/statestore'),
      Graph;

  var LINE_HEIGHT = 20;
  var PADDING = 10;

  var Store = Reflux.createStore({
    mixins: [StoreStateMixin,],

    highlight: function(id) {
      // body...
    },

    getOutputs: function () {
      if (this.state.model.mapper && this.state.model.mapper.opts) {
        var input = _.map(this.props.mapper.opts.output, function (val, key) {
          return _.extend({}, val, { name: key,  id: key });
        });
        return input;
      }

      return null;
    },

    getTypes: function () {
      var fields = [];

      if (this.state.model.mapper && this.state.model.field_source) {
        fields = _.chain().map(this.props.mapper.field_source, function (fs) {
          return fs.type;
        }).uniq().value();
      }

      return fields;
    },

    getFields: function () {
      var fields = null;

      if (this.state.model && this.state.model.field_source) {
        var field_source = _.sortBy(this.state.model.field_source, 'type');
        fields = [];

        fields = _.map(field_source, function (val) {
          return _.extend({}, val, { name: val.value , id: genKey({ name: val.value, key: val.key }) });
        });
      }

      return fields;
    }
  });

  function genKey(obj) {
    var name = obj.name,
        key = obj.key || '';

    return slugify(name + ' ' + key);
  }

  var BoxTable = React.createClass({
    _boxes: [],

    addBox: function (box) {
      this._boxes.push(box);
    },

    getBoxes: function () {
      return this._boxes;
    },

    getBox: function (id) {
      return _.find(this._boxes, { id: id });
    },

    resetBoxes: function () {
      this._boxes = [];
    },

    render: function () {
      var pos = LINE_HEIGHT,
          title = this.props.title,
          style = _.extend({}, {
            strokeWidth: 1,
            stroke: '#000',
            fill: '#fff',
            fillOpacity: 0,
            strokeLocation: 'outside'
          });

      this.resetBoxes();

      var nodes = _.map(this.props.inputs, function (input) {
        pos += LINE_HEIGHT;

        var box = {
          key: input.name,
          x: this.props.x + 10,
          y: pos,
          width: Math.max(this.props.maxWidth, 200),
          height: LINE_HEIGHT,
          value: input.value,
          type: input.type,
          id: input.id
        };

        this.addBox(box);

        return <BoxCell {...box} ref={ input.id } key={ input.id } title={ input.name } />;
      }, this);

      return (
        <g>
          <rect height={Math.max(pos + PADDING, 100) } width={ Math.max(this.props.maxWidth, 200) } x={ this.props.x } y={ this.props.y } style={ style } />
          <BoxCell x={ this.props.x + PADDING } y={ this.props.y + LINE_HEIGHT } width={ Math.max(this.props.maxWidth, 200) } title={ this.props.title } type={ null } textClassName="box-title"/>
          { nodes }
        </g>
      );
    }
  });

  var BoxCell = React.createClass({
    render: function () {
      var props   = this.props,
          label   = null,
          offsetX = props.x;

      if (this.props.type) {
        label = <text x={ props.x } y={ props.y } fill="black" className="label label-alert">{ props.type }</text>;
        offsetX = props.x + 60;
      }

      return (
        <g className="mapper-row">
          <rect x={ props.x - PADDING } y={ props.y - PADDING * 1.5 } width={ props.width } height={ props.height } />
          { label }
          <text x={ offsetX } y={ props.y } fill="black" className={ props.textClassName }>{ props.title.slice(0,20) }</text>
          <line x1={ props.x - PADDING } x2={ props.x + props.width - PADDING } y1={ props.y + 5 } y2={ props.y + 5 } stroke="black" strokeWidth="1"/>
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

    componentDidUpdate: function () {
      if (this.props.mapper.field_source && (this.state.lines.length === 0 && this.props.mapper.field_source.length > 0)) {
        this.setState({ lines: this.getLines() });
      }
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
      var boxes = null,
          lines = this.state.lines || null;

      return (
        <svg width="100%" height="100%" viewBox={ [0,0,1000,1000].join(' ') }>
          <defs>
            <Marker />
          </defs>
          <BoxTable
            ref="input"
            inputs={ this.getFields() }
            maxWidth={ 300 }
            x={ 0 }
            y={ 0 }
            style={{ fill: '#fff' }}
            title="Source fields" key="input" />
          <BoxTable
            ref="output"
            inputs={ this.getOutputs() }
            maxWidth={ 300 }
            x={ 1000/2 } y={ 0 }
            style={{ fill: '#fff' }}
            title="Output" key="output" />
          { boxes }
          { lines }
        </svg>
      );
    },

    getLines: function () {
      var lines = [];

      if (this.props.mapper && this.props.mapper.opts) {
        var pointsLeft = [],
            pointsRight = [];

        _.each(this.props.mapper.field_source, function (fs) {
          var key   = fs.key,
              type  = fs.type,
              value = fs.value;

          var p  = this.refs.input.getBox(genKey({ name: value, key: key })),
              p2 = this.refs.output.getBox(key);

          if (p && p2) {
            var x1 = p.width + p.x - PADDING,
                x2 = p2.x - PADDING,
                y1 = p.y - 5,
                y2 = p2.y - 5;

            var l = <path
                      d={ sprintf("M %s %s L %s %s", x1, y1, x2, y2) }
                      fill="none"
                      stroke="black"
                      strokeWidth="1"
                      markerEnd="url(#Triangle)"
                      key={ genKey({ name: value, key: key }) }/>;

            lines.push(l);
          }
        }, this);
      }

      return lines;
    }
  });

  return Graph;
});
