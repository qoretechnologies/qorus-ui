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
      diff                = require('deep-diff').diff,
      utils               = require('utils');
      
  require('react.backbone');
  require('jquery.fixedheader');
  
  
  var TdComponent = React.createClass({
    shouldComponentUpdate: function (nextProps) {
      var should = (!_.isEqual(this.props, nextProps) || this.props.hash !== nextProps.hash);
      
      return should;
    },
    
    render: function () {
      var props = _.omit(this.props, 'children');
      
      return <td {...props}>{ this.props.children }</td>;
    }
  });
  
  var RowMixin = {
    getDefaultProps: function () {
      return {
        clicked: false
      };
    },
    
    shouldComponentUpdate: function (nextProps, nextState) {
      nextProps = _.omit(nextProps, ['children']);
      nextProps.clicked = nextProps.clicked || false;

      var props = _.omit(this.props, ['children']);
      var should = (!_.isEqual(props, nextProps) || !_.isEqual(this.state, nextState));
      
      if (should) { console.log('should', _.pick(props, ['hash']), _.pick(nextProps, ['hash']), diff(props, nextProps)); }
      
      return should;
    },
    
    processColumns: function () {
      var children = this.props.children,
          row = this.props.model,
          cols = {};
    
      children.forEach(function (col, indx) {
        var child = col.props.children,
            clone = child ? cloneWithProps(child, { model: row, displayName: 'Clone' }) : null,
            props = child ? child.props : col.props,
            tRow;


        if (col.props.cellView) {
          tRow = <col.props.cellView {...props} model={ row } hash={ row.hash }>{ clone }</col.props.cellView>;
        } else {
          tRow = <TdComponent {...props} model={ row } hash={ row.hash }>{ clone }</TdComponent>;
        }
        
        cols['col-'+indx] = tRow;
      }, this);


      return React.addons.createFragment(cols);
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
    
      return <tr className={ [css, this.props.className].join(' ') } onClick={this.props.rowClick.bind(null, model.id)}>{ children }</tr>;
    }
  });
  
  var RowView = React.createClass({
    mixins: [RowMixin],
    
    propTypes: {
      model: React.PropTypes.object.isRequired,
      clicked: React.PropTypes.bool
    },
    
    render: function () {
      var model = this.props.model,
          css = React.addons.classSet({ 'table-row': true, 'info': this.props.clicked }),
          children = this.processColumns();

      return <tr className={ [css, this.props.className].join(' ') } onClick={this.props.rowClick.bind(null, this.props.idx)}>{ children }</tr>;
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
      return <thead className={ React.addons.classSet({ header: this.props.fixed })}>
               <tr>
                 { this.props.children }
               </tr>
             </thead>;
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
      
      return <table className={ this.props.cssClass || this.props.className } style={ style }>
               <THeadView fixed={ this.props.fixed }>
                { React.addons.createFragment(header_columns) }
               </THeadView>
               <tbody>
                 { React.addons.createFragment(rows) }
               </tbody>
             </table>;
    },
    
    _renderNextRows: function () {
      var csize = _.size(this.props.collection);
      var size = (this.state.showed_items > csize) ? csize : this.state.showed_items + CHUNK_SIZE;
      
      this.setState({
        showed_items: size
      });
    },
    
    renderRows: function () {
        var collection      = false ? this.props.collection.slice(0, 30) : this.props.collection,
            children        = _.isArray(this.props.children) ? this.props.children : [this.props.children],
            props           = this.props,
            DefaultRowView  = this.props.rowView || RowView,
            tableProps      = _.omit(props, 'children'),
            isBackbone      = collection instanceof Backbone.Collection || collection instanceof FilteredCollection,
            rows = null;

        _.each(collection, function (row, idx) {
          if (!rows) {
            rows = {};
          }
        
          row = isBackbone ? collection.at(idx) : row;
          
          var DefaultRowView = props.rowView || (isBackbone ? ModelRowView : RowView),
              clicked        = props.current_model ? props.current_model == row.id : false,
              key            = isBackbone ? row.id : idx;

          rows['row'+key] =  <DefaultRowView 
                               model={ row } 
                               rowClick={props.rowClick} 
                               clicked={ clicked }>
                                { children }
                             </DefaultRowView>;
        });      

      return rows;
    },
        
    renderHeader: function () {
      var header, 
          children = _.isArray(this.props.children) ? this.props.children : [this.props.children],
          tprops   = this.props;

      React.Children.forEach(children, function (child, idx) {
        var props     = _.pick(child.props, ['className', 'dataSort']),
            orderKey  = tprops.orderKey || tprops.collection.sort_key,
            order     = tprops.order || tprops.collection.sort_order;
            
        if (!header) header = {};

        if (orderKey == props.dataSort) {
          props.className = [props.className, 'sort', 'sort-'+ order].join(' ');
        }

        header['th-'+idx] = <th {...props} key={ idx } data-sort={child.props.dataSort} 
          onClick={ tprops.sortClick ? tprops.sortClick.bind(null, props.dataSort, null) : _.noop }>{ child.props.name }</th>;
      });  
      
      return header;
    }
  });
  
  var CellView = React.createClass({
    propTypes: {
      model: PropTypes.object.isRequired,
      dataKey: PropTypes.string.isRequired
    },
    
    getValue: function () {
      var model = this.props.model,
          key = this.props.dataKey;
          
      if (model instanceof Backbone.Model) {
        return model.get(key, 'N/A');
      } else {
        return _.result(model, key, 'N/A');
      }
    },
    
    render: function () {
      var value = this.getValue();
      
      return <span>{ value }</span>;
    }
  });
  
  var CellBackbone = React.createBackboneClass({
    propTypes: {
      model: PropTypes.object.isRequired,
      dataKey: PropTypes.string.isRequired
    },
    
    render: function () {
      var obj = this.props.model;
      return <span>{ obj.get(this.props.dataKey) }</span>;
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