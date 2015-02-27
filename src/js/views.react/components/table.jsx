define(function (require) {
  var React               = require('react'),
      Reflux              = require('reflux'),
      Backbone            = require('backbone'),
      FilteredCollection  = require('backbone.filtered.collection'),
      _                   = require('underscore'),
      LoaderView          = require('jsx!views.react/components/loader'),
      NoDataView          = require('jsx!views.react/components/nodata'),
      $                   = require('jquery'),
      PropTypes           = React.PropTypes,
      cloneWithProps      = React.addons.cloneWithProps,
      views               = {},
      CHUNK_SIZE          = 50;
      
  require('react.backbone');
  require('jquery.fixedheader');
  
  var ModelRowView = React.createBackboneClass({
    mixins: [React.addons.PureRenderMixin],
    
    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    
    render: function () {
      var model = this.getModel(),
          css = React.addons.classSet({ 'table-row': true, 'info': this.props.clicked }),
          children = this.props.children.map(function (child) {
            return cloneWithProps(child, { model: this.model });
          });
    
      return (
        <tr className={ [css, this.props.className].join(' ') } onClick={this.props.rowClick.bind(null, model.id)}>{ this.props.children }</tr>
      );
    }
  });
  
  var RowView = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    
    propTypes: {
      model: React.PropTypes.object.isRequired,
    },
    
    render: function () {
      var model = this.props.model,
          css = React.addons.classSet({ 'table-row': true, 'info': this.props.clicked }),
          children = this.props.children.map(function (child) {
            return cloneWithProps(child, { model: this.model });
          });

      return (
        <tr className={ [css, this.props.className].join(' ') } onClick={this.props.rowClick.bind(null, this.props.idx)}>{ children }</tr>
      );
    }
  });
  
  var THeadView = React.createClass({
    componentDidMount: function () {
      if (this.props.fixed) {
        var $el = $(this.getDOMNode());
        var clgrp = $('<colgroup />');

        $el.find('colgroup').remove();

        $el.find('tr').first().children().each(function () {
          clgrp.append($('<col />').width($(this).outerWidth()));
        });
        
        $el.parent('table')
          .prepend(clgrp)
          .addClass('table-fixed')
          .fixedHeader();
      }
    },
    
    render: function () {
      return (
          <thead className={ React.addons.classSet({ header: this.props.fixed })}>
            <tr>
              { this.props.columns }
            </tr>
          </thead>
      );
    }
  });
  
  
  var TableView = React.createClass({
    propTypes: {
      collection: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
      ]).isRequired,
      rowView: React.PropTypes.func
    },
    
    getDefaultProps: function () {
      return {
        rowView: RowView,
        chunked: false,
        rowClick: _.noop
      };
    },
  
    // TODO: missing rowview when assigned with props
    render: function () {
      var columns, rows, style, header_columns,
          props = this.props,
          children = _.isArray(this.props.children) ? this.props.children : [this.props.children],
          isBackbone = this.props.collection instanceof Backbone.Collection || this.props.collection instanceof FilteredCollection;
    
      if (isBackbone && !this.props.collection_fetched) {
        return (<LoaderView />);
      }
      
      if (_.size(this.props.collection) === 0) {
        return (<NoDataView />);
      }
      
      header_columns = children.map(function (child, idx) {
        var props = _.pick(child.props, ['className', 'dataSort']);

        return <th {...props} key={ idx } data-sort={child.props.dataSort}>{ child.props.name }</th>;
      });      
      
      rows = this.renderRows();
      
      return (
        <table className={ this.props.cssClass || this.props.className } style={ style }>
          <THeadView columns={ header_columns } fixed={ this.props.fixed } />
          <tbody>
            { rows }
          </tbody>
        </table>
      );
    },
    
    _renderNextRows: function () {
      var csize = _.size(this.props.collection);
      var size = (this.state.showed_items > csize) ? csize : this.state.showed_items + CHUNK_SIZE;
      
      this.setState({
        showed_items: size
      });
    },
    
    renderRows: function () {
/*      var slice           = this.state.showedItems + CHUNK_SIZE,*/
      var collection      = false ? this.props.collection.slice(0, 10) : this.props.collection,
          children        = _.isArray(this.props.children) ? this.props.children : [this.props.children],
          props           = this.props,
          DefaultRowView  = this.props.rowView || RowView;
    
      var rows = collection.map(function (row, idx) {
        var cols = children.map(function (col, idx) {
          var child = col.props.children,
              clone = cloneWithProps(child, { model: row }),
              props = child.props;
              
          if (col.props.cellView) {
            return <col.props.cellView {...props} _model={ props.model } key={idx}>{ clone }</col.props.cellView>;
          }
              
          return <td {...props} key={idx}>{ clone }</td>;
        });

        return <DefaultRowView key={row.id} 
                 idx={row.id || idx } model={row} 
                 rowClick={props.rowClick} 
                 clicked={(props.current_model && props.current_model == row.id)}>
                  { cols }
               </DefaultRowView>;
      });
      
/*
      if (_.size(this.props.collection) > slice) {
        _.defer(this._renderNextRows, 500);
      }
*/
      
      return rows;
    }
    
  });
  
  var CellView = React.createClass({
    propTypes: {
      model: PropTypes.object.isRequired,
      dataKey: PropTypes.string.isRequired
    },
    
    render: function () {
      var obj = this.props.model.toJSON();
      return <span>{ obj[this.props.dataKey] }</span>;
    }
  });
  
  return {
    TableView: TableView,
    RowView: RowView,
    ModelRowView: ModelRowView,
    CellView: CellView
  };
});