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
      CHUNK_SIZE          = 50,
      Filtered            = require('backbone.filtered.collection'),
      utils               = require('utils');
      
  require('react.backbone');
  require('jquery.fixedheader');
  
  
  var TdComponent = React.createClass({
    shouldComponentUpdate: function (nextProps) {
      return (!_.isEqual(this.props, nextProps) || this.props.hash !== nextProps.hash);
    },
    
    render: function () {
      var props = _.omit(this.props, 'children');
      
      return <td {...props}>{ this.props.children }</td>;
    }
  });
  
  var RowMixin = {
    shouldComponentUpdate: function (nextProps, nextState) {
      nextProps = _.omit(nextProps, ['children']);
      nextProps.clicked = nextProps.clicked || false;

      var props = _.omit(this.props, ['children']);
      var should = (!_.isEqual(props, nextProps) || !_.isEqual(this.state, nextState));
      
      return should;
    },
    
    processColumns: function () {
      var children = this.props.children,
          row = this.props.model;
    
      var cols = children.map(function (col, indx) {
        var child = col.props.children,
            clone = cloneWithProps(child, { model: row, displayName: 'Clone' }),
            props = child.props;

        if (col.props.cellView) {
          return <col.props.cellView {...props} key={ indx } model={ row }>{ clone }</col.props.cellView>;
        }

        return <TdComponent {...props} model={ row } hash={ row.hash } key={ indx }>{ clone }</TdComponent>;
      });
      return cols;
    }
  };

  var ModelRowView = React.createBackboneClass({
    mixins: [RowMixin],
    
    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      clicked: React.PropTypes.bool
    },

    render: function () {
      var model = this.props.model,
          css = React.addons.classSet({ 'table-row': true, 'info': this.props.clicked }),
          children = this.processColumns();
    
      return (
        <tr className={ [css, this.props.className].join(' ') } onClick={this.props.rowClick.bind(null, model.id)}>{ children }</tr>
      );
    }
  });
  
  var RowView = React.createClass({
    mixins: [RowMixin],
    
    propTypes: {
      model: React.PropTypes.object.isRequired,
    },
    
    render: function () {
      var model = this.props.model,
          css = React.addons.classSet({ 'table-row': true, 'info': this.props.clicked }),
          children = this.processColumns();

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
        chunked: false,
        rowClick: _.noop
      };
    },
  
    // TODO: missing rowview when assigned with props
    render: function () {
      var columns, rows, style, header_columns,
          props       = this.props,
          children    = _.isArray(this.props.children) ? this.props.children : [this.props.children],
          isBackbone  = this.props.collection instanceof Backbone.Collection || this.props.collection instanceof FilteredCollection;
    
      if (isBackbone && !this.props.collection_fetched) {
        return (<LoaderView />);
      }
      
      if (_.size(this.props.collection) === 0) {
        return (<NoDataView />);
      }
      
      header_columns = this.renderHeader();
      
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
      console.log('renderRows');
/*      var slice           = this.state.showedItems + CHUNK_SIZE,*/
      var collection      = false ? this.props.collection.slice(0, 30) : this.props.collection,
          children        = _.isArray(this.props.children) ? this.props.children : [this.props.children],
          props           = this.props,
          DefaultRowView  = this.props.rowView || RowView;
    
      this._rows = collection.map(function (row, idx) {
        var isBackbone     = row instanceof Backbone.Model,
            DefaultRowView = props.rowView || (isBackbone ? ModelRowView : RowView),
            clicked        = props.current_model ? props.current_model == row.id : false;

        return <DefaultRowView key={ row.id || idx } 
                 idx={row.id || idx } model={ row } 
                 rowClick={props.rowClick} 
                 clicked={ clicked }>
                  { children }
               </DefaultRowView>;
      });
      
/*
      if (_.size(this.props.collection) > slice) {
        _.defer(this._renderNextRows, 500);
      }
*/      
      return this._rows;
    },
        
    renderHeader: function () {
      var header_columns, 
          children = this.props.children,
          tprops   = this.props;

      header_columns = children.map(function (child, idx) {
        var props     = _.pick(child.props, ['className', 'dataSort']),
            orderKey  = tprops.orderKey || tprops.collection.sort_key,
            order     = tprops.order || tprops.collection.sort_order;

        if (orderKey == props.dataSort) {
          props.className = [props.className, 'sort', 'sort-'+ order].join(' ');
        }

        return <th {...props} key={ idx } data-sort={child.props.dataSort} onClick={ tprops.sortClick ? tprops.sortClick.bind(null, props.dataSort, null) : _.noop }>{ child.props.name }</th>;
      });  
      
      return header_columns;
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
  
  var CellBackbone = React.createBackboneClass({
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
    CellView: CellView,
    CellBackbone: CellBackbone
  };
});